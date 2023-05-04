<template>

    <div class="content">
        <div class="loading" v-if="codeBackApi === api.ReturnCodes.NoCode">
            Chargement...
        </div>

        <div class="user-data" v-else-if="codeBackApi === api.ReturnCodes.Success">
            <div class="avatar-txt">
                <img id="avatar" src="../assets/img/avatar.png" alt="Avatar de l'utilisateur">
                <p>
                    Bievenue <span>{{ userCar.pseudo }}</span> !<br>
                    Tu trouveras tout ce dont tu as besoin sur ces pages...
                </p>
            </div>

            <img id="car" src="../assets/img/car.png" alt="Voiture de l'utilisateur">

            <h2>Tableau de bord</h2>
            <p>Clique sur n'importe quel de ces badges, ils te permetteront </p>
            <div class="badges">
                <div>
                    <img src="../assets/img/course.png" alt="Badge course">
                    <p>Course</p>
                </div>
                <div>
                    <img src="../assets/img/classement.png" alt="Badge classement">
                    <p>Classement</p>
                </div>
                <div>
                    <img src="../assets/img/video.png" alt="Badge vidéo">
                    <p>Video</p>
                </div>
                <div>
                    <img src="../assets/img/modification.png" alt="Badge modification">
                    <p>Modification</p>
                </div>

                <div>
                    <img src="../assets/img/stage.png" alt="Badge inscription stage">
                    <p>Stage</p>
                </div>
                <div>
                    <img src="../assets/img/live.png" alt="Badge live">
                    <p>Live</p>
                </div>
            </div>
        </div>

        <div class="error" v-else-if="codeBackApi === api.ReturnCodes.NotFound">
            Erreur, impossible de trouver la voiture
        </div>

        <div class="error" v-else>
            Erreur innatendue
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useCarStore} from '@/stores/car'
import {useRouter} from "vue-router";
import api from "../models/api";

let userCar = useCarStore()
console.log(useRouter().currentRoute.value.params.id)
let status = userCar.initUserCarUrl(useRouter().currentRoute.value.params.id);

let codeBackApi = ref(0);
status.then(value => codeBackApi.value = value)

</script>

<style scoped lang="scss">

div.error {
  color: var(--red);
}

div.loading, div.error {
  text-align: center;
  margin: auto;
  position: absolute;
  top: 50%;
  left: calc(50% - 100px);
  width: 200px;
}

div.user-data {
  display: flex;
  flex-direction: column;
  align-items: center;

  div.avatar-txt {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 300px;
  }

  img#avatar {
    max-width: 160px;
    margin-bottom: 20px;
  }

  img#car {
    max-width: 300px;
  }

  p {
    text-align: center;

    span {
      font-weight: bold;
    }
  }

  div.badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 85%;

    p {
      margin: 5px 0;
    }

    img {
      width: 110px;
      height: 110px;
    }

    :nth-child(3),
    :nth-child(4),
    :nth-child(5),
    :nth-child(6) {
      margin-top: 20px;
    }
  }
}

div.error {

}

</style>