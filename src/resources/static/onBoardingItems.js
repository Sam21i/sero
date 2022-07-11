import i18n from '../../../i18n';
import {colors} from '../../styles/App.style';
import images from '../images/images';

let CONTENTS = ['emergency', 'contacts', 'assessment', 'securityplan', 'midata'];

let ON_BOARDING_ITEMS = [
  {
    key: 1,
    title: i18n.t('onboarding.emergency.title'),
    text: i18n.t('onboarding.emergency.text'),
    background: images.imagesPNG.backgrounds.moodBlue,
    image: images.imagesPNG.onboarding.emergencyContactIcon,
    themeColor: colors.petrol,
    titleColor: colors.petrol
  },
  {
    key: 2,
    title: i18n.t('onboarding.contacts.title'),
    text: i18n.t('onboarding.contacts.text'),
    background: images.imagesPNG.backgrounds.moodBlue,
    image: images.imagesPNG.onboarding.myEnvironmentIcon,
    themeColor: colors.petrol,
    titleColor: colors.petrol
  },
  {
    key: 3,
    title: i18n.t('onboarding.assessment.title'),
    text: i18n.t('onboarding.assessment.text'),
    background: images.imagesPNG.backgrounds.moodYellow,
    image: images.imagesPNG.onboarding.assessmentIcon,
    themeColor: colors.gold,
    titleColor: colors.gold
  },
  {
    key: 4,
    title: i18n.t('onboarding.securityplan.title'),
    text: i18n.t('onboarding.securityplan.text'),
    background: images.imagesPNG.backgrounds.moodLightOrange,
    image: images.imagesPNG.onboarding.securityplanIcon,
    themeColor: colors.primary,
    titleColor: colors.primary
  },
  {
    key: 5,
    title: i18n.t('onboarding.midata.title'),
    text: i18n.t('onboarding.midata.text'),
    background: images.imagesPNG.backgrounds.moodGrey,
    image: images.imagesPNG.onboarding.midata,
    themeColor: colors.white,
    titleColor: colors.black
  }
];

i18n.on('languageChanged', function (lng) {
  ON_BOARDING_ITEMS.forEach((item, index) => {
    ON_BOARDING_ITEMS[index].title = i18n.t('onboarding.' + CONTENTS[index] + '.title');
    ON_BOARDING_ITEMS[index].text = i18n.t('onboarding.' + CONTENTS[index] + '.text');
  });
});

export default ON_BOARDING_ITEMS;
