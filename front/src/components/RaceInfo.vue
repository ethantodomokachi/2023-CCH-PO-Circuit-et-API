<template>
    <div :style="{
        marginRight: props.displayRank ? '25' : '0'
    }" class="race-content">
        <div :style="{
            width: props.displayRank ? '100%' : 'fit-content'
        }" class="content-1">
            <RankInfo v-if="props.displayRank" :rank="props.rank"></RankInfo>
            <div class="best-time">
                <div>Manche n°{{ props.numRace }}</div>
                <p class="hour">{{ formatHourDay(props.race.raceStart) }}</p>
                <div class="race-time">
                    <span>{{ formatTime(props.race.totalTime) }}</span>
                    <span>s</span>
                </div>
            </div>
        </div>
        <div :style="{
            flexDirection: props.displayRank ? 'row' : 'column-reverse',
            width: props.displayRank ? '100%' : 'fit-content',
            minWidth: props.displayRank ? '280' : '0',
            marginTop: props.displayRank ? '35px' : '20px'
        }" class="content-2">
            <div :style="{
                marginTop: props.displayRank ? '0' : '25px'
            }" class="vitesse">
                <div>Vitesse instantanée</div>
                <div class="speed-max">
                    <p>{{ formatSpeed(props.race.speed) }}</p>
                    <p>{{ unitSpeed }}</p>
                </div>
            </div>

            <div class="time-inter">
                <div>Temps intermédiaires</div>
                <ul>
                    <li>
                        <NumberTime class="num-race" color="var(--red)" number="1"/>
                        <p>{{
                            formatTime(calculateSector(new Date(props.race.sector1), new Date(props.race.raceStart)))
                            }}</p>
                        <span>s</span>
                    </li>
                    <li>
                        <NumberTime class="num-race" color="var(--blue)" number="2"/>
                        <p>{{
                                formatTime(calculateSector(new Date(props.race.sector2), new Date(props.race.raceStart)))
                            }}</p>
                        <span>s</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import Race, { calculateSector, formatHourDay, formatSpeed, formatTime, unitSpeed } from '@/models/race';
import type { models } from '@/models/api';
import { defineAsyncComponent } from "vue";

const NumberTime = defineAsyncComponent(() => import('@/components/NumberTime.vue'));
const RankInfo = defineAsyncComponent(() => import('@/components/RankInfo.vue'));

const props = defineProps<{
  race: Race | models.parsedData.RaceData,
  numRace: number
  rank: number
  displayRank: boolean
}>();

</script>

<style lang="scss" scoped>
div.race-content {
  flex: 1;
  height: fit-content;
  margin-right: 25px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  div.content-1 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: fit-content;
    max-width: 297px;
    margin: 0;
    width: 100%;

    div.best-time {
      width: 140px;
      display: flex;
      text-align: center;
      flex-direction: column;

      div:nth-child(1) {
        font-weight: 515;
      }

      p.hour {
        font-size: 15px;
        font-style: italic;
      }

      div.race-time {
        font-family: 'Digital-7 Mono', sans-serif;
        font-size: 45px;

        span:nth-child(2) {
          font-family: 'Poppins', sans-serif;
          font-size: 24px;
          margin-left: 7px;
        }
      }

      img {
        width: 35px;
      }
    }
  }

  div.content-2 {
    display: flex;
    justify-content: space-between;
    min-width: 280px;
    max-width: 305px;
    margin: 35px 0 0 0;
    width: 100%;

    div.vitesse {
      width: fit-content;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;

      > div:nth-child(1) {
        width: 120px;
        font-weight: 515;
        margin-bottom: 10px;
      }
    }

    div.time-inter {
      width: 140px;
      display: flex;
      flex-direction: column;
      text-align: center;
      justify-content: center;
      align-items: center;

      div {
        font-weight: 515;
      }

      p:nth-child(1) {
        font-size: 40px;
      }

      ul li:nth-child(1) {
        margin-top: 8px;
      }

      ul li p {
        font-size: 22px;
      }

      .num-race {
        margin-right: 10px;
      }

      span {
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        margin-left: 5px;
      }
    }

    div.speed-max {
      display: flex;
      width: fit-content;
      align-items: end;

      p:nth-child(1) {
        font-size: 45px;
        font-family: 'Digital-7 Mono', sans-serif;
      }

      p:nth-child(2) {
        font-size: 15px;
      }
    }

    ul {
      margin: 0;
      padding: 0;
      width: fit-content;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        font-family: 'Digital-7 Mono', sans-serif;
        width: fit-content;
        font-size: 26px;
        margin-top: 10px;
      }
    }
  }
}

</style>
