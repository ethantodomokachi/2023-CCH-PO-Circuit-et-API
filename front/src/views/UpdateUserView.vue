<template>
    <div class="content">
        <dialog id="connection-dialog" ref="dialog">
            <div class="header">
                <h2>Connexion</h2>
                <button @click.prevent="cancel"><img :src="cancelIcon" alt="close"></button>
            </div>
            <form @submit.prevent="() => connect(car.idQuery!, password)">
                <label for="password">Code de la voiture </label>
                <input id="password"
                       v-model="password"
                       :class="error.length > 0 ? 'errored' : ''"
                       name="password"
                       type="text">
                <div class="button-container">
                    <button type="submit">Se connecter</button>
                </div>
            </form>
        </dialog>

        <dialog id="exit-dialog" ref="dialogExit">
            <div class="header">
                <h2>Avertissement</h2>
                <button @click.prevent="closeModal"><img :src="cancelIcon" alt="close"></button>
            </div>
            <div>
                <p>Tu n'as as enregistré tes modifications!</p>

                <p>Es-tu sûr de vouloir quitter?</p>
            </div>
            <div class="button-container">
                <button @click="closeModal">Non</button>
                <button class="destructive" @click="quitPage">Oui</button>
                <button class="main" @click="saveAndQuit">Enregistrer
                </button>
            </div>
        </dialog>

        <h1>Pilote</h1>
        <p>Sur cette page, tu peux modifier complètement ton avatar ainsi que ton pseudo ! Laisse courir ton
            imagination...</p>
        <div class="modify-avatar">
            <template v-if="isLaptop">
                <div class="tab">
                    <div class="title">
                        <div :class="numTabOpen === 1 ? 'tab-checked' : ''" class="tab1" @click="clickTab(1)">
                            <label>
                                <input :checked="numTabOpen == 1" name="tab" type="radio">
                                <img :src="faceIcon" alt="Icon visage homme">
                            </label>
                        </div>
                        <div :class="numTabOpen === 2 ? 'tab-checked' : ''" class="tab2" @click="clickTab(2)">
                            <label>
                                <input :checked="numTabOpen == 2" name="tab" type="radio">
                                <img :src="hangerIcon" alt="Icon de ceintre">
                            </label>
                        </div>
                    </div>

                    <div class="tab-content">
                        <div>
                            <template v-for="props in numTabOpen === 1 ? avatarPropertiesHead : avatarPropertiesClothes"
                                      :key="props.propNameEn">
                                <AvatarRadioSelector v-if="props.propType == TYPE_PROPS_TXT"
                                                     :is-phone="false"
                                                     :property="avatarProperties.find(v=>v.propNameEn === props.propNameEn)!"
                                                     @update:property="editProperties"/>
                                <AvatarColorPicker v-else
                                                   :is-phone="false"
                                                   :property="avatarProperties.find(v=>v.propNameEn === props.propNameEn)! as models.RadioProperty<string>"
                                                   @update:property="editProperties"/>
                            </template>
                        </div>
                    </div>
                </div>

                <div>
                    <div :style="{display: displayMsgValid}" class="msg-success">
                        <img :src="validateIcon"
                             alt="Icon de validation de l'enregistrement des données">
                    </div>
                    <div :style="{opacity: opacityAvatar}" class="content-avatar">
                        <AutoRegeneratedAvatar :avatar-config="config"></AutoRegeneratedAvatar>
                    </div>

                    <div class="modify-pseudo">
                        <label for="pseudo">Pseudo </label>
                        <input id="pseudo" v-model="pseudo" :class="duplicatePseudoError ? 'errored' : ''"
                               maxlength="10" name="pseudo" type="text">
                    </div>

                    <button ref="updateButton" :disabled="updateDisabled" class="main" @click.prevent="updateUser">
                        Enregistrer
                    </button>
                </div>
            </template>
            <template v-else>
                <div class="avatar-and-pseudo">
                    <div class="modify-pseudo">
                        <label for="pseudo">Pseudo </label>
                        <input id="pseudo" v-model="pseudo" :class="duplicatePseudoError ? 'errored' : ''" maxlength="10" name="pseudo" type="text">
                    </div>

                    <div :style="{display: displayMsgValid}" class="msg-success">
                        <img :src="validateIcon"
                             alt="Icon de validation de l'enregistrement des données">
                    </div>
                    <div :style="{opacity: opacityAvatar}" class="content-avatar">
                        <AutoRegeneratedAvatar :avatar-config="config"></AutoRegeneratedAvatar>
                    </div>

                </div>

                <div class="tab">
                    <div class="title">
                        <template v-for="(props, key) in avatarProperties" :key="key">
                            <div v-if="props.propType != TYPE_PROPS_COLOR || props.propNameSnakeCase == 'bg-color' || props.propNameSnakeCase == 'face-color'"
                                 :class="'tab ' + `tab${key} ` + (numTabOpen === key ? 'clicked' : '')"
                                 @click="clickTab(key)">
                                <label>
                                    <input :checked="numTabOpen == key" name="tab-phone"
                                           type="radio">
                                    <ImageModifPhone :image-name="props.propNameSnakeCase"
                                                     :image-name-fr="props.propNameFr"></ImageModifPhone>
                                </label>
                            </div>
                        </template>
                    </div>

                    <div class="tab-content">
                        <template v-if="avatarProperties[numTabOpen].propType == TYPE_PROPS_TXT">
                            <AvatarRadioSelector :is-phone="true"
                                                 :property="avatarProperties[numTabOpen] as models.RadioProperty<string>"
                                                 @update:property="editProperties"/>
                            <AvatarColorPicker
                                    v-if="avatarProperties[numTabOpen + 1].propType == TYPE_PROPS_COLOR
                            && avatarProperties[numTabOpen + 1].propNameSnakeCase != 'bg-color'
                            && avatarProperties[numTabOpen + 1].propNameSnakeCase != 'face-color'"
                                    :is-phone="true"
                                    :property="avatarProperties[numTabOpen + 1] as models.RadioProperty<string>"
                                    @update:property="editProperties"/>
                        </template>

                        <template v-else>
                            <AvatarColorPicker :is-phone="true"
                                               :property="avatarProperties[numTabOpen] as models.RadioProperty<string>"
                                               @update:property="editProperties"/>
                        </template>

                    </div>
                </div>

                <div class="bt-save-phone">
                    <button ref="updateButton" :disabled="updateDisabled" class="main" @click.prevent="updateUser">
                        Enregistrer
                    </button>
                </div>
            </template>
        </div>

        <div v-if="saveIsInvalid" class="show-error">
            <p>* Le pseudo doit contenir au moins 3 caractères.</p>
        </div>

        <div v-if="duplicatePseudoError" class="show-error">
            <p>* Ce pseudo est déjà utilisé.</p>
        </div>
    </div>

</template>

<script lang="ts" setup>
import type { Configs } from 'holiday-avatar';
import { genConfig } from 'holiday-avatar';
import { useCarStore } from '@/stores/car';
import type { Ref } from 'vue';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import api from '@/models/api';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import { useBreakpoints, useLocalStorage } from '@vueuse/core';

import cancelIcon from '@/assets/img/cancel.webp';
import validateIcon from '@/assets/img/checked.webp';
import faceIcon from '@/assets/img/face-color.webp';
import hangerIcon from '@/assets/img/hanger.webp';
import type { models } from '@/models/avatar';

const AvatarColorPicker = defineAsyncComponent(() => import('@/components/AvatarColorPicker.vue'));
const ImageModifPhone = defineAsyncComponent(() => import('@/components/ImageModifPhone.vue'));
const AutoRegeneratedAvatar = defineAsyncComponent(() => import('@/components/AutoRegeneratedAvatar.vue'));
const AvatarRadioSelector = defineAsyncComponent(() => import('@/components/AvatarRadioSelector.vue'));

const router = useRouter();

//Initialisation des données de l'utilisateur
const userCar = useCarStore();
const { car } = userCar;
const password = ref('');
const error = ref('');
const saveIsInvalid = ref(false);
const displayMsgValid = ref('none');
const opacityAvatar = ref('');
const LIMIT_LARGE_CONTENT = 960;
const nextRoute = ref('');
const numTabOpen = ref(1);

const duplicatePseudoError = ref(false);

//Initialisation des constantes
const NAME_HEAD_PROPS = 'head';
const NAME_CLOTHES_PROPS = 'clothes';
const TYPE_PROPS_TXT = 'txt';
const TYPE_PROPS_COLOR = 'color';

// éléments de l'HTML
const dialog = ref<HTMLDialogElement | null>(null);
const dialogExit = ref<HTMLDialogElement | null>(null);

const userCarIdLs = useLocalStorage<null | string>('userCarId', null);
const carTokenLs = useLocalStorage<null | string>('carToken', null);
const numTabOpenLs = useLocalStorage('numTabOpen', 1);

const lastPseudo = useLocalStorage<null | string>('lastPiloteName', null);
const pseudo = useLocalStorage<string>('piloteName', car.pseudo || '');
//Gère le nom du pilote
if (pseudo.value && lastPseudo.value) {
  let piloteName = ref('');

  //Récupération des données par l'api
  api.getDataOneCarId(userCarIdLs.value || '0').then((v) => {

    //Retour si erreur dans la requête
    if ('message' in v.json) {
      error.value = v.json.message;
      return;
    }

    piloteName.value = v.json.pseudo;
  });
}
lastPseudo.value = lastPseudo.value ?? pseudo.value;


const config = useLocalStorage<Configs>('configAvatar', genConfig(car.avatar));
const lastConfigAvatarLs = useLocalStorage<Configs>('lastConfigAvatar', config.value);
// S'il y a quelque chose dans le localstorage avec, on compare avec les données dans la db
if (config.value && lastConfigAvatarLs.value) {
  let avatarValue: Ref<Configs> = ref(config.value);

  //Récupération des données par l'api
  api.getDataOneCarId(userCarIdLs.value || '0').then((v) => {

    //Retour si erreur dans la requête
    if ('message' in v.json) {
      error.value = v.json.message;
      return;
    }

    avatarValue.value = v.json.avatar;

    //Test si les avatars stockés et en ligne sont égaux
    if (avatarEquals(lastConfigAvatarLs.value!, avatarValue.value)) {
      config.value = genConfig(config.value);
    } else {
      config.value = genConfig(avatarValue.value);
      config.value = avatarValue.value;
      lastConfigAvatarLs.value = avatarValue.value;
    }

    //Rempli l'écran des valeurs de l'avatar
    fillAvatarPropreties(config.value);
  });
}
lastConfigAvatarLs.value = lastConfigAvatarLs.value ?? config.value;

//Config
const avatarProperties = computed<models.RadioProperty[]>({
  get: () => [
    {
      propNameFr: 'Genre',
      propNameEn: 'sex',
      propNameSnakeCase: 'sex',
      propType: TYPE_PROPS_TXT,
      propGroups: NAME_HEAD_PROPS,
      propValues: [
        {
          value: 'male',
          label: 'Homme',
        },
        {
          value: 'female',
          label: 'Femme',
        }
      ],
      selectedValue: config.value.sex
    },
    {
      propNameFr: 'Couleur du visage',
      propNameEn: 'faceColor',
      propNameSnakeCase: 'face-color',
      propType: TYPE_PROPS_COLOR,
      propGroups: NAME_HEAD_PROPS,
      propValues: [
        {
          value: '#853',
          label: 'BeigeFonce',
        },
        {
          value: '#ECB',
          label: 'BeigeClair',
        },
        {
          value: '#F11',
          label: 'Rouge',
        },
        {
          value: '#C3B',
          label: 'Rose',
        },
        {
          value: '#13A',
          label: 'Bleu',
        },
        {
          value: '#3A4',
          label: 'Vert',
        },
        {
          value: '#FF0',
          label: 'Jaune',
        }
      ],
      selectedValue: config.value.faceColor
    },
    {
      propNameFr: 'Type des yeux',
      propNameEn: 'eyeType',
      propNameSnakeCase: 'eye-type',
      propType: TYPE_PROPS_TXT,
      propGroups: NAME_HEAD_PROPS,
      propValues: [
        {
          value: 'circle',
          label: 'Ronds',
        },
        {
          value: 'oval',
          label: 'Ovals',
        },
        {
          value: 'smile',
          label: 'Plissés',
        }
      ],
      selectedValue: config.value.eyeType
    },
    {
      propNameFr: 'Type de nez',
      propNameEn: 'noseType',
      propNameSnakeCase: 'nose-type',
      propType: TYPE_PROPS_TXT,
      propGroups: NAME_HEAD_PROPS,
      propValues: [
        {
          value: 'short',
          label: 'Court',
        },
        {
          value: 'long',
          label: 'Long',
        },
        {
          value: 'round',
          label: 'Rond',
        }
      ],
      selectedValue: config.value.noseType
    },
    {
      propNameFr: 'Type de bouche',
      propNameEn: 'mouthType',
      propNameSnakeCase: 'mouth-type',
      propType: TYPE_PROPS_TXT,
      propGroups: NAME_HEAD_PROPS,
      propValues: [
        {
          value: 'laugh',
          label: 'Rire',
        },
        {
          value: 'smile',
          label: 'Sourire',
        },
        {
          value: 'peace',
          label: 'Normal',
        }
      ],
      selectedValue: config.value.mouthType
    },
    {
      propNameFr: 'Taille des oreilles',
      propNameEn: 'earSize',
      propNameSnakeCase: 'ear-size',
      propType: TYPE_PROPS_TXT,
      propGroups: NAME_HEAD_PROPS,
      propValues: [
        {
          value: 'small',
          label: 'Petites',
        },
        {
          value: 'big',
          label: 'Grandes',
        }
      ],
      selectedValue: config.value.earSize
    },
    {
      propNameFr: 'Type de cheveux',
      propNameEn: 'hairType',
      propNameSnakeCase: 'hair-type',
      propType: TYPE_PROPS_TXT,
      propGroups: NAME_HEAD_PROPS,
      propValues: [
        {
          value: 'normal',
          label: 'Normaux',
        },
        {
          value: 'thick',
          label: 'Epais',
        },
        {
          value: 'mohawk',
          label: 'Crête',
        },
        {
          value: 'femaleLong',
          label: 'Très longs',
        },
        {
          value: 'femaleShort',
          label: 'Longs',
        }
      ],
      selectedValue: config.value.hairType
    },
    {
      propNameFr: 'Couleur de cheveux',
      propNameEn: 'hairColor',
      propNameSnakeCase: 'hair-color',
      propType: TYPE_PROPS_COLOR,
      propGroups: NAME_HEAD_PROPS,
      propValues: [
        {
          value: '#000',
          label: 'Noir',
        },
        {
          value: '#974',
          label: 'Brun',
        },
        {
          value: '#E71',
          label: 'Roux',
        },
        {
          value: '#FFB',
          label: 'Blond',
        },
        {
          value: '#1C0',
          label: 'Vert',
        },
        {
          value: '#36E',
          label: 'Bleu',
        },
        {
          value: '#D0E',
          label: 'Rose',
        }
      ],
      selectedValue: config.value.hairColor
    },
    {
      propNameFr: 'Couleur de fond',
      propNameEn: 'bgColor',
      propNameSnakeCase: 'bg-color',
      propType: TYPE_PROPS_COLOR,
      propGroups: NAME_CLOTHES_PROPS,
      propValues: [
        {
          value: '#067',
          label: 'BleuCanard',
        },
        {
          value: '#6CF',
          label: 'BleuClair',
        },
        {
          value: '#3A5',
          label: 'Vert',
        },
        {
          value: '#EF8',
          label: 'Calipo',
        },
        {
          value: '#FC0',
          label: 'Jaune',
        },
        {
          value: '#B22',
          label: 'Rouge',
        },
        {
          value: '#80F',
          label: 'Violet',
        }
      ],
      selectedValue: config.value.bgColor
    },
    {
      propNameFr: 'Type de haut',
      propNameEn: 'shirtType',
      propNameSnakeCase: 'shirt-type',
      propType: TYPE_PROPS_TXT,
      propGroups: NAME_CLOTHES_PROPS,
      propValues: [
        {
          value: 'hoody',
          label: 'Sweat',
        },
        {
          value: 'short',
          label: 'T-shirt',
        },
        {
          value: 'polo',
          label: 'Polo',
        }
      ],
      selectedValue: config.value.shirtType
    },
    {
      propNameFr: 'Couleur du haut (habit)',
      propNameEn: 'shirtColor',
      propNameSnakeCase: 'shirt-color',
      propType: TYPE_PROPS_COLOR,
      propGroups: NAME_CLOTHES_PROPS,
      propValues: [
        {
          value: '#CCC',
          label: 'Gris',
        },
        {
          value: '#FC0',
          label: 'Jaune',
        },
        {
          value: '#E81',
          label: 'Orange',
        },
        {
          value: '#D55',
          label: 'Rouge',
        },
        {
          value: '#0D4',
          label: 'Vert',
        },
        {
          value: '#6CF',
          label: 'BleuClair',
        },
        {
          value: '#44B',
          label: 'Violet',
        }
      ],
      selectedValue: config.value.shirtColor
    },
    {
      propNameFr: 'Type de lunettes',
      propNameEn: 'glassesType',
      propNameSnakeCase: 'glasses-type',
      propType: TYPE_PROPS_TXT,
      propGroups: NAME_CLOTHES_PROPS,
      propValues: [
        {
          value: 'none',
          label: 'Aucunes',
        },
        {
          value: 'round',
          label: 'Rondes',
        },
        {
          value: 'square',
          label: 'Carrées',
        }
      ],
      selectedValue: config.value.glassesType
    },
    {
      propNameFr: 'Type de chapeau',
      propNameEn: 'hatType',
      propNameSnakeCase: 'hat-type',
      propType: TYPE_PROPS_TXT,
      propGroups: NAME_CLOTHES_PROPS,
      propValues: [
        {
          value: 'none',
          label: 'Aucun',
        },
        {
          value: 'beanie',
          label: 'Bonnet',
        },
        {
          value: 'turban',
          label: 'Turban',
        }
      ],
      selectedValue: config.value.hatType
    },
    {
      propNameFr: 'Couleur de chapeau',
      propNameEn: 'hatColor',
      propNameSnakeCase: 'hat-color',
      propType: TYPE_PROPS_COLOR,
      propGroups: NAME_CLOTHES_PROPS,
      propValues: [
        {
          value: '#965',
          label: 'Brun',
        },
        {
          value: '#CCC',
          label: 'Gris',
        },
        {
          value: '#FBB',
          label: 'Rose',
        },
        {
          value: '#FC0',
          label: 'Jaune',
        },
        {
          value: '#D22',
          label: 'Rouge',
        },
        {
          value: '#7D8',
          label: 'Vert',
        },
        {
          value: '#87E',
          label: 'Violet',
        }
      ],
      selectedValue: config.value.hatColor
    }
  ],
  set: (v) => {
    let currentConfig = config.value;
    for (let property of v) {
      if (property.propNameEn in currentConfig) {
        ( currentConfig[ property.propNameEn as keyof Configs ] as Configs[keyof Configs] ) = property.selectedValue;
      }
    }

    // Affectation de la nouvelle config
    config.value = genConfig(currentConfig);

    //Stockage dans le localstorage
    localStorage.setItem('configAvatar', JSON.stringify(currentConfig));
  }
});

const editProperties = (newValue: models.RadioProperty) => {
  const currentProps = avatarProperties.value;
  const index = currentProps.findIndex(v => v.propNameEn === newValue.propNameEn);
  if (index !== -1) {
    currentProps[ index ] = newValue;
  }
  avatarProperties.value = currentProps;
};

//Tri de l'interface pour les deux tabs
const avatarPropertiesHead = computed(() => avatarProperties.value.filter(prop => prop.propGroups === NAME_HEAD_PROPS));
const avatarPropertiesClothes = computed(() => avatarProperties.value.filter(prop => prop.propGroups === NAME_CLOTHES_PROPS));


// Change la classe des éléments des menus pour le petit contenu
const classDisplayModif = useBreakpoints({
  laptop: LIMIT_LARGE_CONTENT,
});

const isLaptop = classDisplayModif.greaterOrEqual('laptop');

/**
 * Connexion de l'utilisateur
 * @param queryId Identifiant d'url de la voiture
 * @param password mot de passe de la voiture
 */
async function connect(queryId: string, password: string) {
  error.value = '';
  //Récupération du Token avec le nom et mot de passe de l'URL
  let valueToken = await api.authenticationQueryIdPwd(queryId, password);

  if ('message' in valueToken.json) {
    error.value = valueToken.json.message;
    return;
  }

  //Si le token est valide
  userCar.token = valueToken.json.token;
  carTokenLs.value = userCar.token;

  dialog.value?.close();

  // Test si enregistrement des données de la voiture
  if (pseudo.value !== car.pseudo || ( userCar.car.avatar && !avatarEquals(config.value, userCar.car.avatar) )) {
    await updateUser();
  }
}

/**
 * Compare deux avatars
 * @returns true si les deux avatars sont identiques, false sinon
 */
function avatarEquals(avatar1: Configs, avatar2: Configs) {
  let equality = true;
  Object.keys(avatar1).forEach((key) => {
    if (avatar1[ key as keyof Configs ] !== avatar2[ key as keyof Configs ]) {
      equality = false;
    }
  });
  return equality;
}

const updateDisabled = computed(() => {
  if (!userCar.car.avatar) {
    return false;
  }
  const avatarEq = avatarEquals(config.value, userCar.car.avatar);
  const pseudoEq = pseudo.value.toString() === car.pseudo?.toString();
  return avatarEq && pseudoEq;
});

/**
 * Quitter la page de modification
 */
function cancel() {
  router.push({ path: '/' });
}

/**
 * Met à jour les données de l'utilisateur (de la voiture)
 */
async function updateUser() {
  duplicatePseudoError.value = false;
  // Utilisateur Voiture pour l'enregistrement dans la db
  const reqUserCar = {
    token: userCar.token,
    car: {
      idCar: userCar.car.idCar,
      pseudo: userCar.car.pseudo,
      avatar: config.value
    }
  };

  // Vérification du pseudo
  if (pseudo.value.length < 3) {
    pseudo.value = userCar.car.pseudo ?? '';
    saveIsInvalid.value = true;
    return;
  }
  reqUserCar.car.pseudo = pseudo.value;
  saveIsInvalid.value = false;

  // enregistrement de la voiture
  try {
    const res = await api.updateCar(reqUserCar);
    console.log(res);
    if ('message' in res.json && res.json.message === "Pseudo déjà utilisé") {
      duplicatePseudoError.value = true;
      return;
    }
  } catch (e) {
    carTokenLs.value = null;
    dialog.value?.showModal();
    return;
  }

  opacityAvatar.value = '0.5';
  displayMsgValid.value = 'flex';

  //Affichage de l'icon de succès
  setTimeout(() => {
    opacityAvatar.value = '1';
    displayMsgValid.value = 'none';
  }, 1500);

  // Enregistrement de la voiture dans Pinia
  userCar.car.avatar = JSON.parse(JSON.stringify(reqUserCar.car.avatar));
  userCar.car.pseudo = reqUserCar.car.pseudo;

  //Stockage de "l'ancienne" config
  lastConfigAvatarLs.value = config.value;
  lastPseudo.value = pseudo.value;

  //Ajout du nouvel avatar et du nom dans Pinia
  userCar.car.avatar = JSON.parse(JSON.stringify(config.value));
  userCar.car.pseudo = JSON.parse(JSON.stringify(pseudo.value));
}

/**
 * Ferme la fenêtre modal
 */
function closeModal() {
  dialogExit.value?.close();
}

/**
 * Ouvre la page cliquée par l'utilisateur
 */
function openOtherPage() {
  closeModal();
  console.log('closed modal.');
  router.push({ path: nextRoute.value });
}

function quitPage() {
  //Changement de la localstorage
  config.value = lastConfigAvatarLs.value;
  pseudo.value = lastPseudo.value;
  console.log('quitting...');

  openOtherPage();
}

function saveAndQuit() {
  updateUser().then(openOtherPage);
}

/**
 * Rempli les valeurs sélectionnées à l'écran en fonction de sa config
 * @param config Config de l'utilisateur
 */
function fillAvatarPropreties(config: Configs) {
  for (let prop of avatarProperties.value) {
    let value = config[ prop.propNameEn as keyof Configs ];
    if (typeof value !== 'boolean') {
      prop.selectedValue = value;
    }
  }
}

/**
 * Fonction qui change la valeur du tab cliqué
 * @param numTab Numéro de la tab cliqué
 */
function clickTab(numTab: number) {
  numTabOpen.value = numTab;
  numTabOpenLs.value = numTabOpen.value;
}

//Si l'id de la voiture n'est pas défini alors retour à la page d'accueil
if (!userCar.car.idCar) {
  router.push('/');
}

// Afficher la fenêtre de connexion si l'utilisateur n'est pas connecté
userCar.token = carTokenLs.value || '';
onMounted(() => {
  if (userCar.token === '') {
    dialog.value?.showModal();
  }
});

//Initialisation des variables
if (numTabOpenLs.value) {
  numTabOpen.value = numTabOpenLs.value;
}

//Quand on quitte la page alors on confirme si il y a eu des changements
onBeforeRouteLeave((to) => {

  //Récupération de la route cliqué
  nextRoute.value = to.path;

  //Affichage de la page de confirmation
  if (!updateDisabled.value && localStorage.getItem("userCarId") !== null) {
    dialogExit.value?.showModal();
    return false;
  }
});

</script>

<style lang="scss" scoped>
@import "@/assets/css/consts";
@import 'animate.css';

div.modify-pseudo {
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: center;

  label,
  input {
    display: block;
    margin: .5em 0;
  }

  input {
    width: 165px;
    border-radius: 3px;
    padding: 3px;
    border: 1px solid var(--black);

    &.errored {
      border: 2px solid red;
      animation: 600ms headShake;
    }
  }

  label {
    margin-right: 10px;
    font-weight: bold;
  }


}

button {
  border-radius: 20px;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
  transition: ease-in-out 0.3s;

  &:not(:disabled):hover {
    font-weight: bold;
  }
}

div.modify-avatar {
  display: flex;
  flex-direction: column;


  div.content-avatar {
    display: flex;
    justify-content: end;
    transition: all ease-in-out 0.2s;
    margin-top: 10px;
    margin-bottom: 10px;

    div.avatar {
      width: 250px;
      height: 250px;
      box-shadow: rgba(50, 50, 93, 0.25) 0 13px 27px -5px, rgba(0, 0, 0, 0.3) 0 8px 16px -8px;
      border-radius: 200px;
    }
  }

  div.tab {
    div.title {
      display: flex;

      margin: 10px auto;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      width: 100%;

      .tab {
        width: 45px;
        padding: 8px;
        border-radius: 5px;
        margin: 5px;
        box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
        filter: grayscale(0.95);
        transition: 0.2s ease-in-out;

        &:hover, &.clicked {
          filter: none;
          transition: 0.2s ease-in-out;
          cursor: pointer;

          img {
            cursor: pointer;
          }
        }
      }

      input {
        display: none;
      }
    }

    .tab-content {
      box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
      max-width: 595px;
      margin: 0 auto;
      border-radius: 7px;
      padding: 2px 10px 8px 10px;
    }
  }

  div.bt-save-phone {
    margin: 15px 0;
    display: flex;
    width: 100%;
    justify-content: center;
  }

  @media screen and (min-width: 960px) {
    width: 95%;
    margin: 25px auto 0 auto;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    transition: all ease-in-out 0.1s;

    > div:nth-child(2) {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 40%;

      div.content-avatar {
        div.avatar {
          width: 300px;
          height: 300px;
        }
      }
    }

    div.tab {
      display: flex;
      width: 60%;
      min-height: 480px;

      div.title {
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        margin: 0 20px 0 0;
        align-items: start;
        justify-content: start;
        border-right: 1px solid rgba(194, 194, 194, 0.45);
        padding-right: 20px;
        width: fit-content;

        .tab1 {
          margin-bottom: 8px;
        }

        .tab2 {
          margin-top: 8px;
        }

        > div {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          box-shadow: inset 0 0 27px rgba(50, 50, 93, 0), rgba(50, 50, 93, 0.2) 0 13px 27px -5px;
          border: 1px solid rgba(50, 50, 93, 0.1);
          padding: 4px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 300ms ease-in-out;

          * {
            transition: all 300ms ease-in-out;
          }

          &.tab-checked {
            box-shadow: inset 0 0 27px rgba(50, 50, 93, 0.1), rgba(50, 50, 93, 0) 0 13px 27px -5px;
            cursor: default;

            * {
              cursor: default;
            }
          }

          &:not(.tab-checked):hover {
            box-shadow: inset 0 0 27px rgba(50, 50, 93, 0.1), rgba(50, 50, 93, 0) 0 13px 27px -5px;
          }


          label {
            cursor: pointer;
            text-align: center;
            width: 50px;
          }

          input {
            display: none;
          }

        }

        img {
          width: 45px;
        }

        input {
          display: block;
        }
      }


      div.tab-content {
        display: flex;
        flex-direction: column;
        box-shadow: none;
        max-width: 100%;
        margin: unset;
        border-radius: 0;
        padding: 0;

        > div {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: start;

          &:nth-child(1) {
            width: 100%;
            height: 100%;
          }
        }

        fieldset {
          width: 100%;
          padding-right: 30px;

          &.color {
            padding-left: 30px;
          }

          &:nth-child(1) {
            padding-left: 0;
          }
        }

        div fieldset:nth-child(2) {
          padding-left: 0;
        }
      }
    }
  }
}

input.errored {
  border: 2px solid red;
  animation: 600ms headShake;
}

#connection-dialog, #exit-dialog {
  border: none;
  border-radius: 1em;
  padding: 15px;

  div.header {
    h2 {
      width: unset;
    }

    button {
      img {
        height: 2.5em;
      }

      background-color: unset;
      border: none;
      cursor: pointer;
      padding: 0;
      width: fit-content;
      margin-right: 5px;
    }

    display: flex;
    justify-content: space-between;
  }


  form {
    label,
    input {
      display: block;
      margin: 1em 0;
    }

    input {
      margin-bottom: .1em;
      border: 1px solid var(--black);
      border-radius: 10px;

      &.errored {
        border: 2px solid red;
        animation: 600ms headShake;
      }
    }
    div.button-container {
      display: flex;
      justify-content: center;
    }
  }
}

#connection-dialog {
  width: 250px;
  div.header {
    align-items: flex-start;
    justify-content: space-between;
    button {
      margin: 0;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: .75em;

    input {
      margin: .75em 0 0;
      width: 6em;
      text-align: center;
      padding: .5em;
      border-radius: 20px;
    }

    label {
      width: fit-content;
      margin: 0;
    }
  }
}

#exit-dialog {
  width: 500px;
  min-height: 200px;


  div.button-container {
    display: flex;
    justify-content: end;
    margin-top: 35px;

    button {
      width: 7em;
      margin: 0 5px;
      padding: 5px 3px;
    }
  }
}

div.show-error {
  margin-top: 10px;
  color: var(--red);
  text-align: center;
  font-weight: bold;

  p {
    font-size: 15px;

  }
}

div.msg-success {
  width: 300px;
  height: 300px;
  display: flex;
  position: absolute;
  z-index: 900;
  justify-content: center;
  align-items: center;
  transition: all ease-in-out 0.2s;
  border-radius: 200px;
  padding: 10px;

  img {
    width: 80px;
    height: 80px;
  }
}

</style>
