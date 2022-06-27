import {colors} from '../../styles/App.style';
import images from '../images/images';

export const ON_BOARDING_ITEMS = [
  {
    key: 1,
    title: 'onboarding.emergency.title',
    text: 'onboarding.emergency.text',
    background: images.imagesPNG.backgrounds.moodBlue,
    image: images.imagesPNG.onboarding.emergencyContactIcon,
    themeColor: colors.petrol,
    titleColor: colors.petrol
  },
  {
    key: 2,
    title: 'onboarding.contacts.title',
    text: 'onboarding.contacts.text',
    background: images.imagesPNG.backgrounds.moodBlue,
    image: images.imagesPNG.onboarding.myEnvironmentIcon,
    themeColor: colors.petrol,
    titleColor: colors.petrol
  },
  {
    key: 3,
    title: 'onboarding.assessment.title',
    text: 'onboarding.assessment.text',
    background: images.imagesPNG.backgrounds.moodYellow,
    image: images.imagesPNG.onboarding.assessmentIcon,
    themeColor: colors.gold,
    titleColor: colors.gold
  },
  {
    key: 4,
    title: 'onboarding.securityplan.title',
    text: 'onboarding.securityplan.text',
    background: images.imagesPNG.backgrounds.moodLightOrange,
    image: images.imagesPNG.onboarding.securityplanIcon,
    themeColor: colors.primary,
    titleColor: colors.primary
  },
  {
    key: 5,
    title: 'onboarding.midata.title',
    text: 'onboarding.midata.text',
    background: images.imagesPNG.backgrounds.moodGrey,
    image: images.imagesPNG.onboarding.midata,
    themeColor: colors.white,
    titleColor: colors.black
  }
];
