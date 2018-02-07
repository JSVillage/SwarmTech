const _ = require('lodash')

const events = [
  {
    icon: 'avalanche1.png',
    tooltip: 'Avalanche',
  },
  {
    icon: 'blast.png',
    tooltip: 'Explosion',
  },
  {
    icon: 'cowabduction.png',
    tooltip: 'Cow Abduction',
  },
  {
    icon: 'earthquake-3.png',
    tooltip: 'Earthquake',
  },
  {
    icon: 'fire.png',
    tooltip: 'Fire',
  },
  {
    icon: 'linedown.png',
    tooltip: 'Power lines down',
  },
  {
    icon: 'pirates.png',
    tooltip: 'Pirates',
  },
  {
    icon: 'planecrash.png',
    tooltip: 'Plane Crash',
  },
  {
    icon: 'radiation.png',
    tooltip: 'Radiation',
  },
  {
    icon: 'rescue-blue.png',
    tooltip: 'Resolution in Progress',
  },
  {
    icon: 'rescue-green.png',
    tooltip: 'Resolved',
  },
  {
    icon: 'shooting.png',
    tooltip: 'Shooting',
  },
  {
    icon: 'star-green.png',
    tooltip: 'Resolved',
  },
  {
    icon: 'theft.png',
    tooltip: 'Theft',
  },
  {
    icon: 'tornado-2.png',
    tooltip: 'Tornado',
  },
  {
    icon: 'treedown.png',
    tooltip: 'Tree Down',
  },
  {
    icon: 'tsunami.png',
    tooltip: 'Tsunami',
  },
  {
    icon: 'zombie-outbreak1.png',
    tooltip: 'Zombies',
  },
]

events.random = () => {
  const i = Math.random() * (10 - 1) | 0
  return events[i]
};

events.find = (tooltip) => _.find(events, {tooltip})

module.exports = events
