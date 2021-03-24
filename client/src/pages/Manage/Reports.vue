<template>
  <div class="reports-wrapper">
    <div class="header">
      <div>Total users: {{ users.total }}</div>
      <div>Premium users: {{ premiumUsers.total }}</div>
      <div>Active users: {{ activeUsers.total }}</div>
      <div>Total Listings: {{ listings.total }}</div>
    </div>
    <div class="requests-charts" style="display: flex; align-items: center; flex-direction: column; justify-content: center; margin-bottom: 20px;">
      <div style="font-size: 2.3em;">Analytics</div>
      <iframe style="background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" width="1000" height="580" src="https://charts.mongodb.com/charts-project-0-voqlv/embed/charts?id=c4200edd-c995-4756-8075-1518828bf83a&theme=light"></iframe>
    </div>
    <div class="charts" style="display: flex; align-items: center; justify-content: space-between; padding: 20px;">
      <div class="user-chart">
        <div style="font-size: 2.3em;">Users created</div>
        <iframe style="background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" width="640" height="480" src="https://charts.mongodb.com/charts-project-0-voqlv/embed/charts?id=58c93509-9d34-467f-aae8-632a29bb350a&theme=light"></iframe>
      </div>
      <div class="listings-chart">
        <div style="font-size: 2.3em;">Listings Published</div>
        <iframe style="background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" width="600" height="480" src="https://charts.mongodb.com/charts-project-0-voqlv/embed/charts?id=ec189d61-bd7c-4e44-9a57-0f6f8bb2d8c0&theme=light"></iframe>
      </div>
    </div>
  </div>
</template>

<script>

  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'Reports',
    mounted(){
      this.loadUsers();
      this.loadListings();
    },
    methods: {
      ...mapActions('users', {
        loadUsers: 'find'
      }),
      ...mapActions('listings', {
        loadListings: 'find'
      }),
    },
    computed: {
      ...mapGetters('users', {
        getUsers: 'find'
      }),
      ...mapGetters('listings', {
        getListings: 'find'
      }),
      users(){
        return this.getUsers();
      },
      premiumUsers(){
        return this.getUsers({query: {premium: true}});
      },
      activeUsers(){
        return this.getUsers({query: {active: true}})
      },
      listings(){
        return this.getListings();
      }
    }
  };
</script>

<style scoped>
  .header {
    display: flex;
    margin: 20px;
    width: 95%;
    justify-content: space-between;
    font-size: 2em;
  }
</style>
