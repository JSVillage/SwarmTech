const _ = require('lodash')
let {Syncable, Model, Set, env} = require('swarm')
env.warn = console.error

// this monkey patches a Syncable constructor to add a ready() function
function addReady(Constructor) {

  oldCheckUplink = Constructor.prototype.checkUplink

  _.merge(Constructor.prototype, {
    checkUplink() {
      // add ready initial state
      this._ready = false
      this.once('init', () => this._ready = true)
      oldCheckUplink.apply(this)
    },
    // immediately call callback if init has already happened,
    // otherwise wait for init
    ready(done) {
      // swarm once doesn't actually work...
      // I think because a timing issue due to function wrapping/delegation...
      // multiple calls can come through before the this.off is called
      done = _.once(done)

      if (this._ready) {
        done(null, this)
        return this

      } else {
        this.once('init', () => done(null, this))
        return this
      }
    },
  })
}

// augment Syncable with helper methods for detecting when state is ready
addReady(Syncable)

module.exports = function loadModels(models) {

  // wrapper API that exposes more DB-like characteristics than the base swarm library
  const db = {
    models: {},

    // getters/setters
    setModel: function setModel(model, id, value) {
      var obj

      // retrieve the model from the server
      if (id) {
        obj = db.getModel(model, id)

        // TODO: try retrieving it from the set
        // will be needed for editing a chat message
        // but not for creating/sending

      // create a local model
      // WORKAROUND: we can't retrieve models from the host without an ID,
      // and I don't know how to have the host generate an ID
      } else {
        const M = db.models[model]
        obj = new M
      }

      // add it to the corresponding set
      const IDSet = db.getModelSet(model)
      IDSet.ready(() => IDSet.addObject(obj))

      // set the new value
      obj.set(value)

      return obj
    },
    getModel: function getModel(model, id) {
      return env.localhost.get('/'+model+'#'+id)
    },
    getModelSet: function getModelSet(model) {
      let Model = db.models[model]
      if (!Model) throw new Error('invalid model:', model)
      if (Model._plural) model = Model._plural
      const listSpec = '/'+model+'#'+model.toLowerCase()

      return env.localhost.get(listSpec)
    },
    listModel: function listModel(model, done) {
      db.getModelSet(model).ready((err, set) => done(null, db.setToIds(set)))
    },
    setToIds: function setToIds(set) {
      return set.pojo().entries.map(id => id.split('#')[1])
    }
  }

  models.forEach(m => {
    const model = Model.extend(m.name, m.config)
    model._plural = m.plural
    db.models[m.name] = model
  })
  models.forEach(m => db.models[m.plural] = Set.extend(m.plural, {}))

  return db
}
