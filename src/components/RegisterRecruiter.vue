<template>
    <NavBar />
    <div class="profile-container">
        <div class="insert-div">
            <div class="info-header">
                <p>{{ errorText }}</p>
            </div>
            <form @submit.prevent="handleRegister">
            <div class="form-group">
                <label for="firstName">First name:</label>
                <input type="text" id="firstName" v-model="firstName" :class="{ 'error': emptyField && firstName == ''}">
            </div>
            <div class="form-group">
                <label for="lastName">Last name:</label>
                <input type="text" id="lastName" v-model="lastName" :class="{ 'error': emptyField && lastName == ''}">
            </div>
            <div class="form-group">
                <label for="email">Email address:</label>
                <input type="text" id="email" v-model="email" :class="{ 'error': emptyField && email == ''}">
            </div>
            <div class="form-group">
                <label for="phoneNumber">Phone number:</label>
                <input type="text" id="phoneNumber" @input="validatePhoneNumber" v-model="phoneNumber" :class="{ 'error': emptyField && phoneNumber == ''}">
            </div>
            <div class="form-group" >
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" :class="{ 'error': emptyField && password == ''}">
            </div>
            <div class="form-group">
                <label for="password">Confirm password:</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" :class="{ 'error': confirmPassword != '' && isPasswordMismatch && !confirmPasswordFocused }" @focus="confirmPasswordFocused = true" @blur="confirmPasswordFocused = false">
            </div>
            <div class="form-group">
                <label for="companyExists">Does the company already exist on this website?</label>
                <select id="companyExists" v-model="companyExists">
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
                </div>
            <div v-if="companyExists === 'yes'" class="form-group">
                <label for="companyName">Company name:</label>
                <input type="text" id="companyName" v-model="companyName">
            </div>
            <div v-else-if="companyExists === 'no'" class="form-group">
                <label for="companyName">Company name:</label>
                <input type="text" id="companyName" v-model="companyName">
                <label for="webPage">Website:</label>
                <input type="text" id="webPage" v-model="webPage">
                <label for="image">Company image:</label>
                <div style="width:100%; height:100%">
                    <simple-button secondary class="secondary-button" type="button" @click="openFileInput">{{ photoText }}</simple-button>
                    <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" accept="image/*" />
                </div>
            </div>
                <simple-button primary class="submit">Sign up</simple-button>
            </form>
            </div>
        </div>
  </template>
  
  <script>
  import NavBar from './NavBar.vue';
  import SimpleButton from './SimpleButton.vue';
  import { mapGetters, mapActions } from 'vuex';
  import store from '@/store';
  import router from '@/router';
  
  export default {
    computed: {
    ...mapGetters(['isLoggedIn', 'token']),
    isPasswordMismatch() {
      return this.password !== this.confirmPassword;
    }
    },
    components: {
      NavBar,
      SimpleButton,
    },
    data() {
      return {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        confirmPasswordFocused: false,
        errorText: '',
        emptyField: false,
        isSubmitting: false,
        companyExists: '',
        webPage: '',
        companyName: '',
        photoText: 'Upload photo',
        imageData: '',
        photo: '',
        submitting: false,
      };
    },
    methods: {
      ...mapActions(['logout']),
      async handleRegister() {
        if (this.submitting) {
            return;
        }
        this.submitting = true;
        console.log("im in");
        if (!this.checkFields()) {
            this.submitting = false;
            return;
        }

        let existent = this.companyExists === "yes" ? true : false;
        console.log(JSON.stringify({
                email: this.email,
                password: this.password,
                firstName: this.firstName,
                lastName: this.lastName,
                phoneNumber: this.phoneNumber,
                company: {
                    existent: existent,
                    name: this.companyName,
                    webPage: this.webPage,
                    image: this.imageData,
                },
              }));


        try {
            const response = await fetch('http://localhost:8080/api/users/recruiters/request', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: this.email,
                password: this.password,
                firstName: this.firstName,
                lastName: this.lastName,
                phoneNumber: this.phoneNumber,
                company: {
                    existent: existent,
                    name: this.companyName,
                    webPage: this.webPage,
                    image: this.imageData,
                },
              }),
            });
            console.log(response.status);
            this.submitting = false;
            switch (response.status) {
                case 200:
                    router.push({path: "/login", query: { recruiter: true} });
                    break;
                case 404: 
                    this.errorText = "Company not found.";
                    break;
            }
            
          } catch (error) {
            console.error('Error POSTing:', error);
          }
      },
      checkFields() {
        if (this.firstName == '' ||
        this.lastName == '' ||
        this.email == '' ||
        this.password == '' ||
        this.confirmPassword == '' ||
        this.phoneNumber == '' ||
        this.password != this.confirmPassword) {
            this.emptyField = true;
            this.errorText = "Please fill in all fields";
            return false;
        } else {
            return true;
        }
      },
      validatePhoneNumber() {
        this.phoneNumber = this.phoneNumber.replace(/\D/g, '');
    },
    openFileInput() {
      if (this.submitting) {
        return;
      }
      
      this.submitting = true;
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
        this.photo = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            this.imageData = e.target.result.split(',')[1]; // Extract the base64 data from the data URL
            this.photoText = "Change photo";
            this.submitting = false;
        };

        reader.readAsDataURL(this.photo);
    },
    async testImageRenderFromBlob() {
      var blob = await this.blobFromImage();
      const array = new Uint8Array(await blob.arrayBuffer());
      return array;
    },
    async blobFromImage() {
      return new Blob([await new Response(this.photo).arrayBuffer()], { type: this.photo.name });
    },
    },
    
    
    async mounted() {
        if (this.isLoggedIn) {
          store.commit('logout');
        }
      },
  };
  </script>
    
  
<style scoped>
.error {
    background-color: #ffcccc; 
    border: 1px solid #ff0000; 
}
  .profile-container {
    max-width: 90%;
    max-height: 80%;
    background-color: white;
    margin: 2% auto;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-y:hidden;
    padding-bottom:50px;
  }
  
  .form-group {
    display: flex;
    padding-left:5%;
    padding-right:10%;
  }

  .form-group select {
    background-color: rgba(255, 255, 255, 0.5);
    font-size: 16px;
    padding: 10px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .form-group label {
    font-size:18px;
  }
  
  .submit {
    margin-top:20px;
    width: 85%;
    margin-left:5%; 
  }
  
  .insert-div {
    max-height:100%;
    margin-top:30px;
  }
  
  .insert-div label {
    margin-top:5px;
    margin-bottom: 2px;
  }
  
  .insert-div simple-button {
    width:50%;
  }

  .info-header {
    font-size:18px;
    max-height:40px;
    padding-left:5%;
    padding-right:10%;
    color: #ff0000;
  }
  
  </style>