<template>
<div>
  <p>
    The game has ended, <a href="javascript:;" @click="onOpenPlayerDetailRequested">{{getWinnerAlias()}}</a> is the winner!
  </p>

  <p>
    <small>Show your support and award <span class="text-warning">badges</span> and <span class="text-warning">renown</span> to your friends and enemies alike.</small>
  </p>

  <!-- Rank Change -->
  <table v-if="hasRankResults" class="table table-sm">
    <thead>
      <tr>
        <td><small>Player</small></td>
        <td class="text-right"><small>Rank Change</small></td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="rank in event.data.rankingResult.ranks" :key="rank.playerId">
        <td><small>{{getPlayerAlias(rank.playerId)}}</small></td>
        <td class="text-right"><small>{{rank.current}}<i class="fas fa-arrow-right ml-2 mr-2"></i>{{rank.new}}</small></td>
      </tr>
    </tbody>
  </table>

  <!-- ELO Change -->
  <p v-if="hasEloRatingResult && userPlayerRating && userPlayerRating.newRating != userPlayerRating.oldRating">
    <small>Your ELO rating has changed from <span class="text-info">{{userPlayerRating.oldRating}}</span> to <span class="text-warning">{{userPlayerRating.newRating}}</span>.</small>
  </p>
  <p v-if="hasEloRatingResult && userPlayerRating && userPlayerRating.newRating === userPlayerRating.oldRating">
    <small>Your ELO is unchanged. (<span class="text-success">{{userPlayerRating.newRating}}</span>)</small>
  </p>
</div>
</template>

<script>
import GameHelper from '../../../../../services/gameHelper'

export default {
  components: {

  },
  props: {
    event: Object
  },
  data () {
    return {
      userPlayerRating: null
    }
  },
  mounted () {
    let userPlayer = GameHelper.getUserPlayer(this.$store.state.game)

    if (this.hasEloRatingResult) {
      if (this.event.data.rankingResult.eloRating.winner._id === userPlayer._id) {
        this.userPlayerRating = this.event.data.rankingResult.eloRating.winner
      } else {
        this.userPlayerRating = this.event.data.rankingResult.eloRating.loser
      }
    }
  },
  methods: {
    getWinnerAlias () {
      let winnerPlayer = GameHelper.getPlayerById(this.$store.state.game, this.$store.state.game.state.winner)

      return winnerPlayer.alias
    },
    onOpenPlayerDetailRequested (e) {
      this.$emit('onOpenPlayerDetailRequested', this.$store.state.game.state.winner)
    },
    getPlayerAlias (playerId) {
      return GameHelper.getPlayerById(this.$store.state.game, playerId).alias
    }
  },
  computed: {
    hasRankResults () {
      return this.event.data && this.event.data.rankingResult && this.event.data.rankingResult.ranks && this.event.data.rankingResult.ranks.length
    },
    hasEloRatingResult () {
      return this.event.data && this.event.data.rankingResult && this.event.data.rankingResult.eloRating
    }
  }
}
</script>

<style scoped>
</style>