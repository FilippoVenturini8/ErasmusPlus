<template>
  <Header></Header>
  <img v-if="receivedOriginalOffer" class="wallpaper mt-5" :src="getImageUrl(wallpaper)">
  <img v-if="receivedOriginalOffer" class="icon" :src="getImageUrl(logo)">

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-5">
      <input class="form-control" type="text" v-model="nameUniversity" :placeholder="nameUniversity">
    </div>
  </div>

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-5">
      <input class="form-control" type="text" v-model="city" :placeholder="city">
    </div>
  </div>

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-5">
      <input class="form-control" type="text" v-model="country" :placeholder="country">
    </div>
  </div>

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-2">
      <input class="form-control" type="text" v-model="latitude" placeholder="Latitudine">
    </div>
    <div class="mb-3 col-2">
      <input class="form-control" type="text" v-model="longitude" placeholder="Longitudine">
    </div>
  </div>

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-5">
      <textarea class="form-control" v-model="plot" id="exampleFormControlTextarea1" rows="3" :placeholder="plot"></textarea>
    </div>
  </div>

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-5">
      <label>Periodo: </label>
      <div class="form-check form-check-inline m-lg-3">
        <input class="form-check-input" v-model="period" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="6" :checked="this.period === '6'">
        <label class="form-check-label" for="inlineRadio1">6 mesi</label>
      </div>
      <div class="form-check form-check-inline">
        <input class="form-check-input" v-model="period" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="12" :checked="this.period === '12'">
        <label class="form-check-label" for="inlineRadio2">12 mesi</label>
      </div>
    </div>
  </div>

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-5">
      <label for="formFile" class="form-label">Logo:</label>
      <input class="form-control"  type="file" id="iconFile" @change="onIconChange">
    </div>
  </div>

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-5">
      <label for="formFile" class="form-label">Immagine di copertina:</label>
      <input class="form-control"  type="file" id="wallpaperFile" @change="onWallpaperChange">
    </div>
  </div>

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-5">
      <label for="formFile" class="form-label">Immagine per la miniatura:</label>
      <input class="form-control"  type="file" id="universityCardFile" @change="onCardImageChange">
    </div>
  </div>

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-5 form-group">
      <label for="exampleFormControlSelect1">Ambito di studi:</label>
      <select v-if="receivedOriginalOffer" class="form-control" id="exampleFormControlSelect1" v-model="field">
        <option value="Ingegneria Informatica" :selected="this.fieldOfStudySelected('Ingegneria Informatica')">Ingegneria Informatica</option>
        <option value="Artificial Intelligence" :selected="this.fieldOfStudySelected('Artificial Intelligence')">Artificial Intelligence</option>
        <option value="Data Science" :selected="this.fieldOfStudySelected('Data Science')">Data Science</option>
        <option value="Sistemi Embedded" :selected="this.fieldOfStudySelected('Sistemi Embedded')">Sistemi Embedded</option>
      </select>
    </div>
  </div>

  <div class="row d-flex justify-content-center">
    <div class="mb-3 col-5">
      <label for="formFile" class="form-label">Posti disponibili:</label>
      <input class="form-control"  type="number"  id="placesValue" v-model="places">
    </div>
  </div>
  <div class="row">
    <button class="mb-5 btn btn-success btnAdd" data-bs-toggle="modal" data-bs-target="#addOfferModal">Modifica</button>
  </div>
  <div class="modal fade" id="addOfferModal" tabindex="-1" aria-labelledby="myModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Conferma modifica offerta</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Confermi la modifica dell'offerta?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" @click="this.modifyOffer()" data-bs-dismiss="modal" data-bs-toggle="modal" data-bs-target="#offerAddedModal" >Conferma</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="offerAddedModal" tabindex="-1" aria-labelledby="myModal" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Conferma modifica offerta</h1>
        </div>
        <div class="modal-body">
          L'offerta è stata modificata correttamente
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-success" data-bs-dismiss="modal" @click="this.redirect()">Ok</button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import {defineComponent} from "vue";
import Header from "@/components/Header.vue";
import axios from "axios";

export default defineComponent({
  name: "UpdateOfferPage",
  components: {Header},
  data(){
    return{
      nameUniversity: "",
      city: "",
      country: "",
      latitude: "",
      longitude: "",
      period: "",
      places: "",
      field: "",
      logo: "",
      wallpaper: "",
      cardImg: "",
      plot: "",
      reviews: [],
      receivedOriginalOffer: false,
      originalOffer: [],
    }
  },
  methods:{
    onCardImageChange(e){
      if (! e.target.files.length) return;

      let file = e.target.files[0];

      let reader = new FileReader();

      reader.readAsDataURL(file);

      const myArray = document.getElementById("universityCardFile").value.split("\\");
      this.cardImg = "./../../assets/img/universityImgCards/" + myArray[2];
    },
    onWallpaperChange(e){
      if (! e.target.files.length) return;

      let file = e.target.files[0];

      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = e => {
        this.wallpaperImage = e.target.result;
      };

      const myArray = document.getElementById("wallpaperFile").value.split("\\");
      this.wallpaper = "./../../assets/img/universityWallpapers/" + myArray[2];
    },
    onIconChange(e){
      if (! e.target.files.length) return;

      let file = e.target.files[0];
      let reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = e => {
        this.iconImage = e.target.result;
      };

      const myArray = document.getElementById("iconFile").value.split("\\");
      this.logo = "./../../assets/img/universityLogos/" + myArray[2];

    },
    modifyOffer(){
      const newNameUniversity = this.nameUniversity;
      const idUniversity = this.id;
      const json = {name:this.nameUniversity,
        city:this.city,
        country:this.country,
        latitude:this.latitude,
        longitude:this.longitude,
        offer:{
          period:this.period,
          places:document.getElementById("placesValue").value,
          field:this.field,
        },
        logo: this.logo,
        wallpaper:this.wallpaper,
        cardImg:this.cardImg,
        plot:this.plot,
        reviews:this.reviews
      };
      axios.put('http://localhost:3000/updateOffer' + this.id, json, {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      });

      axios.get('http://localhost:3000/users').then(response =>{
        this.users = response.data;
        const jsonNotifications = [];
        this.users.forEach(function(user){
          jsonNotifications.push({
            id: user.identificationNumber,
            text: "L'offerta relativa a " + newNameUniversity + " è stata modificata",
            read: "false",
            goto: "/universitydetail/" + idUniversity
          })
        });
        jsonNotifications.forEach(function (jsonUser){
          try{
            axios.post('http://localhost:3000/sendNotificationToUser', jsonUser, {
              headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
              }
            })
          } catch (e) {
            console.log(e)
          }
        })

      }).catch(err => {
        console.log(err);
      })
    },
    redirect() {
      window.location.replace("/universitydetail/" + this.id);
    },
    getOriginalOffer(id){
      axios.get('http://localhost:3000/universitydetail' + id).then(response => {
            this.originalOffer = response.data;
            this.latitude = this.originalOffer.latitude;
            this.longitude = this.originalOffer.longitude;
            this.nameUniversity = this.originalOffer.name;
            this.country = this.originalOffer.country;
            this.places = this.originalOffer.offer.places;
            this.field = this.originalOffer.offer.field;
            this.plot = this.originalOffer.plot;
            this.city = this.originalOffer.city;
            this.period = this.originalOffer.offer.period;
            this.logo = this.originalOffer.logo;
            this.wallpaper = this.originalOffer.wallpaper;
            this.cardImg = this.originalOffer.cardImg;
            this.reviews = this.originalOffer.reviews;
            this.receivedOriginalOffer = true;
          }
      ).catch(err => {
        console.log(err);
      })
    },
    fieldOfStudySelected(value){
      return this.field === value
    },
    getImageUrl(url){
      return new URL(`${url.slice(3)}`, import.meta.url)
    }
  },
  mounted() {
    if(sessionStorage.getItem('role') !== "Admin"){
      window.location.replace("/404");
    }
    this.id = this.$route.params.id;
    this.getOriginalOffer(this.id);
    if(sessionStorage.getItem('role') !== "Admin"){
      window.location.replace("/");
    }
  }
});
</script>

<style scoped>
.wallpaper{
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 2em;
  box-shadow: 0 5px 10px rgba(0,0,0,.2);
  border: 1px solid #000000;
}
.icon{
  width: 200px;
  height: 200px;
  margin-top: -100px;
  margin-left: 100px;
  border: 1px solid #000000;
  box-shadow: 0 5px 10px rgba(0,0,0,.2);
}
.btnAdd{
  display: block;
  margin: 50px auto;
  width: 100px;
}
</style>