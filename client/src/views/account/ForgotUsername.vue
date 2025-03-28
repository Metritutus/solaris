<template>
  <view-container>
    <view-title title="Forgot Username" navigation="home"/>

    <form-error-list v-bind:errors="errors"/>

    <form @submit.prevent="handleSubmit">
      <div class="mb-2">
        <label for="email">Email Address</label>
        <input type="email" required="required" class="form-control" name="email" v-model="email" :disabled="isLoading">
      </div>

      <div>
        <button type="submit" class="btn btn-success" :disabled="isLoading">Send Username</button>
        <router-link to="/" tag="button" class="btn btn-danger float-end">Cancel</router-link>
      </div>
    </form>

    <p class="mt-3">Not receiving emails? Contact a developer on <a href="https://discord.com/invite/v7PD33d">Discord</a>.</p>

    <loading-spinner :loading="isLoading"/>
  </view-container>
</template>

<script>
import LoadingSpinnerVue from '../components/LoadingSpinner.vue'
import ViewContainer from '../components/ViewContainer.vue'
import router from '../../router'
import ViewTitle from '../components/ViewTitle.vue'
import FormErrorList from '../components/FormErrorList.vue'
import userService from '../../services/api/user'

export default {
  components: {
    'loading-spinner': LoadingSpinnerVue,
    'view-container': ViewContainer,
    'view-title': ViewTitle,
    'form-error-list': FormErrorList
  },
  data () {
    return {
      isLoading: false,
      errors: [],
      email: null
    }
  },
  methods: {
    async handleSubmit (e) {
      this.errors = []

      if (!this.email) {
        this.errors.push('Email required.')
      }

      e.preventDefault()

      if (this.errors.length) return

      try {
        this.isLoading = true

        let response = await userService.requestUsername(this.email)

        if (response.status === 200) {
          this.$toast.success(`Your username has been sent to your email address, please check your email inbox.`)
        } else {
          this.$toast.error(`There was a problem requesting your username, please check that you entered your email address correctly.`)
        }

        router.push({ name: 'home' })
      } catch (err) {
        this.errors = err.response.data.errors || []
      }

      this.isLoading = false
    }
  }
}
</script>

<style scoped>
</style>
