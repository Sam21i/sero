export const ASSESSMENT_RESOURCES = {
  intro: {
    title: 'Was ist PRISM-S?',
    description: 'Mit PRISM-S kannst du einschätzen, wie stark dein Drang ist, dir das Leben zu nehmen.',
    prismImage:
      '<?xml version="1.0" encoding="UTF-8"?><svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.89 595.28"><defs><style>.cls-1{fill:#fab30d;}.cls-2{fill:#fff;}.cls-3{fill:#1d1d1b;}</style></defs><rect class="cls-2" width="841.89" height="595.28"/><g><circle class="cls-1" cx="685.98" cy="439.37" r="119.29"/><circle class="cls-3" cx="243.82" cy="220.87" r="99.21"/></g></svg>',
    explanation: [
      (item1 = 'Die weisse Fläche stellt dein Leben bzw. deinen Lebensraum dar. '),
      (item2 = 'Der gelbe Punkt bist du in deinem Leben.'),
      (item3 = 'Die schwarze Scheibe steht für deinen momentanen Drang, dir das Leben zu nehmen.')
    ]
  },
  tutorial: {
    title: 'Anleitung',
    description: 'Platziere die schwarze Scheibe in deinem Lebensraum (weisse Fläche).',
    prismImage:
      '<?xml version="1.0" encoding="UTF-8"?><svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.89 595.28"><defs><style>.cls-1{fill:none;stroke:#808081;stroke-dasharray:0 0 12 12;stroke-linecap:round;stroke-miterlimit:10;stroke-width:4px;}.cls-2{fill:#fab30d;}.cls-3{fill:#fff;}.cls-4{fill:#1d1d1b;}.cls-5{fill:#808081;}</style></defs><rect class="cls-3" width="841.89" height="595.28"/><g><circle class="cls-2" cx="685.98" cy="439.37" r="119.29"/><circle class="cls-4" cx="272.25" cy="116.81" r="99.21"/></g><g><line class="cls-1" x1="571.86" y1="351.28" x2="371.86" y2="194.08"/><path class="cls-5" d="M562.23,319.29c-1.04,.36-1.59,1.51-1.22,2.55l10.13,28.87-30.45-3.03c-1.1-.11-2.08,.69-2.19,1.79-.11,1.1,.71,2.08,1.8,2.19l33.57,3.34c.68,.07,1.35-.22,1.77-.75s.54-1.26,.32-1.9l-11.17-31.84c-.13-.37-.36-.68-.65-.91-.52-.41-1.23-.55-1.9-.32Z"/><path class="cls-5" d="M405.21,195.88c-.11,1.1-1.09,1.9-2.19,1.79l-30.45-3.03,10.13,28.87c.37,1.04-.18,2.19-1.22,2.55-1.04,.36-2.19-.19-2.55-1.23l-11.17-31.84c-.22-.64-.11-1.36,.32-1.9,.42-.54,1.09-.82,1.77-.75l33.57,3.34c.39,.04,.75,.19,1.04,.42,.52,.41,.83,1.07,.76,1.77Z"/></g></svg>',
    questions: 'Stelle dir dabei die Fragen:',
    questionList: [
      (item1 = 'Welchen Platz in meinern Leben nimmt zurzeit mein Drang ein, mir das Leben zu nehmen?'),
      (item2 = 'Wie nah oder wie weit weg von mir (gelber Punkt) ist dieser Drang im Moment?')
    ],
    distance:
      'Je grösser die Distanz, desto kleiner der Drang sich das Leben zu nehmen. Je kleiner die Distanz desto grösser der Drang.'
  }
};
