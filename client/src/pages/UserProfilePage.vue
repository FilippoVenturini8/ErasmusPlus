<template>
  <Header></Header>
  <ProfileBadge :user="user" :key="user.id"></ProfileBadge>
  <div v-if="this.user.role === 'Studente'">
    <div class="row d-flex text-center mt-5 pt-5">
      <h2>Le mie candidature</h2>
    </div>
    <div v-if="this.applicationsLoaded && this.applications.length === 0" class="d-flex justify-content-center">
      <div class="no-applications align-items-center p-5 mt-5">
        <p style="font-weight: lighter; font-size: 20px">Non hai ancora presentato nessuna candidatura</p>
      </div>
    </div>
    <div v-if="applicationsLoaded && this.applications.length !== 0" class="row d-flex justify-content-center">
      <div class="col-md-5 m-3">
        <table class="table table-bordered">
          <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Università</th>
            <th scope="col">Città</th>
            <th scope="col">Data candidatura</th>
            <th scope="col">Stato</th>
          </tr>
          </thead>
          <tbody>

          <template v-for="(application, index) in this.applications">
            <tr>
              <th scope="row">{{index+1}}</th>
              <td class="universityName" @click="goToUniversityByName(application.university)" style="cursor: pointer">{{application.university}}</td>
              <td>{{application.city}}</td>
              <td>{{application.date}}</td>
              <td v-if="application.state === 'Accettata'" style="color: limegreen; font-weight: bold">{{application.state}}</td>
              <td v-else-if="application.state === 'Rifiutata'" style="color: red; font-weight: bold">{{application.state}}</td>
              <td v-else-if="application.state === 'Attesa'" style="color: #FFC107; font-weight: bold">{{application.state}}</td>
              <td v-else style="font-weight: bold">{{application.state}}</td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="row" style="margin-top: 130px">
    <div class="col-md-7">
      <ProfileInfoPanel :title="msgContacts" :user="user" class="bgGrayContacts"></ProfileInfoPanel>
    </div>
    <div class="col-md-2"></div>
    <div class="col-md-3 circleIconCol" style="margin-top: 50px; padding-left: 90px">
      <UserProfileCircleIcon :title="msgContacts" class="circleIconContacts"></UserProfileCircleIcon>
    </div>
  </div>
  <div class="row" style="margin-top: 200px">
    <div class="col-md-3 circleIconCol" style="padding-right: 90px">
      <UserProfileCircleIcon :title="msgPersonalInfo" class="circleIconPersonalInfo"></UserProfileCircleIcon>
    </div>
    <div class="col-md-2"></div>
    <div class="col-md-7 mb-lg-5">
      <ProfileInfoPanel  :title="msgPersonalInfo" :user="user" class="bgRedPersonalInfo"></ProfileInfoPanel>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import ProfileBadge from "@/components/profile/ProfileBadge.vue";
import axios from "axios";
import {defineComponent} from "vue";
import ProfileInfoPanel from "@/components/profile/ProfileInfoPanel.vue";
import UserProfileCircleIcon from "@/components/profile/UserProfileCircleIcon.vue";

export default defineComponent ({
  name: "UserProfilePage",
  props:['id'],
  components: {UserProfileCircleIcon, ProfileInfoPanel, Header, ProfileBadge},
  data(){
    return{
      user: [],
      applications: [],
      logged: [],
      msgContacts: "Contatti",
      msgPersonalInfo: "Informazioni Personali",
      applicationsLoaded: false,
    }
  },
  methods:{
    getUser(){
      axios.get('http://localhost:3000/userdetail'+ sessionStorage.getItem("mail")).then(response =>{
            this.user = response.data;
            this.getApplication();
      }).catch(err => {
        console.log(err);
      })
    },
    getApplication(){
      axios.get('http://localhost:3000/applications').then(response =>{
        let allApplications;
        allApplications = response.data;
        allApplications.forEach(application => {
            if(application.student === (this.user.name+" "+this.user.surname)) {
              this.applications.push(application);
            }
        })
        this.applicationsLoaded = true;
      }).catch(err => {
        console.log(err);
      })
    },
    goToUniversityByName(name){
      axios.get('http://localhost:3000/universityFromName'+name).then(response => {
        this.$router.push('/universitydetail/'+response.data._id);
        return response.data._id;
      }).catch(err => {
        console.log(err);
        return "";
      })
    }
  },
  mounted() {
    this.getUser();
    this.logged = sessionStorage.getItem("mail");
  }
})
</script>

<style scoped>

.universityName:hover{
  font-weight: bold;
}
.bgRedPersonalInfo{
  background-color: #BB2E29;
  color: #FFFFFF;
  height: 200px;
}
.bgGrayContacts{
  background-color: #717171;
  color: #FFFFFF;
  height: 200px;
}
.circleIconPersonalInfo{
  float: right;
}
.circleIconContacts{
  float: left;
}
.circleIconCol{
  margin-top: 50px
}
.no-applications{
  background:#e3f7fc  no-repeat 10px 50%;
  border:1px solid #8ed9f6;
  border-radius:10px;
}


</style>