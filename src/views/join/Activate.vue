<template>
  <div></div>
</template>

<script>
export default {
  created() {
    this.activate();
  },
  methods: {
    async activate() {
      await this.$store.dispatch("activateCustomer", this.$route.params.token);
      this.$router.push({ name: "submit-info" });
    },
  },
};
</script>

<style scoped></style>
