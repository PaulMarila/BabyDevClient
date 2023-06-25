<script>
import SimpleButton from "@/components/SimpleButton.vue";
import { ref } from "vue";
import router from "@/router";
import store from '@/store';

const email = ref('');
const password = ref('');
const infoText = ref('');
function infoTextSetColorGreen() {
  const elements = document.getElementsByClassName("infoText");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.color = "green";
  }
}
function infoTextSetColorRed() {
  const elements = document.getElementsByClassName("infoText");
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.color = "red";
  }
}

export default {
  name: "MyComponent",
  components: {
    SimpleButton,
  },
  data() {
    return {
      email,
      password,
      infoText,
      isSubmitting: false,
    };
  },
  methods: {
  async handleClickLogin() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    console.log(this.email);
    console.log(this.password);

    try {
      const response = await fetch("http://localhost:8080/api/auth/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.email,
          password: this.password,
        }),
      });
      let tokenResponse;
      console.log(response.status);
      switch(response.status) {
        case 200:
          // console.log(response.status);
          tokenResponse = await response.json();
          this.infoText = "";
          store.commit('login', {
            token: tokenResponse.token,
            photo: tokenResponse.photo,
          });
          router.push("/home");
          break;
        case 206: 
          infoTextSetColorRed();
          this.infoText = "The password is incorrect for this email address.";
          break;
        case 404:
          infoTextSetColorRed();
          this.infoText = "No account with this email address was found.";
          break;
        case 425:
          infoTextSetColorRed();
          this.infoText = "Check your email for the verification link.";
          break;
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isSubmitting = false;
    }
  },
  handleClickRegister() {
    router.push("/register");
  },
},
mounted() {
    const redirectedFromRegister = this.$route.query.redirected;
    const activated = this.$route.query.activated;
    const registeredAsRecruiter = this.$route.query.recruiter;
    if (redirectedFromRegister) {
      infoTextSetColorGreen();
      this.infoText = "Check your email and activate your account within 24 hours.";
    } else if (registeredAsRecruiter) {
      infoTextSetColorGreen();
      this.infoText = "You'll be contacted by our team in maximum 48 hours to discuss the details.";
    } else if (activated) {
      infoTextSetColorGreen();
      this.infoText = "Account activated succesfully, you can log in now";
    }
  },
};


</script>

<template>
  <div class="login-container">
    <div class="login-left">
      <img src="@/assets/logo.png">
      <p>if (goodAtCode) {</p>
      <p>   landJob();</p>
      <p style="padding-right:110px">}                </p>
    </div>
    <div class="login-right">
      <div class="welcome-back">
        <p class="welcome-text">Welcome back!</p>
        <img class="welcome-emoji" src="@/assets/wave_hand.png">
        <p class="welcome-text-part2">Job offers are ready to be explored</p>
      </div>
      <div class="info">
        <p class="infoText">{{ infoText }}</p>
      </div>
      <form @submit.prevent="handleClickLogin">
        <div class="form-group">
          <label for="email">Email address</label>
          <input type="text" id="email" maxlength="254" v-model="email">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" autocomplete="current-password" v-model="password">
          <a class="forgotpass" href="">Forgotten password</a>
        </div>
        <div>
          <simple-button primary class="submit" @click="handleClickLogin">Login</simple-button>
        </div>
      </form>
      <div class="or-register">
        <hr class="smooth-line-left">
        <p class="smooth-line-between">or</p>
        <hr class="smooth-line-right">
      </div>
      <div>
          <simple-button class="submit" primary @click="handleClickRegister">Register for free</simple-button>
      </div>
      
    </div>
  </div>
</template>

<style>
html, body, div {
  height: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

p {
    margin: 0;
  }

.login-container {
  display: flex;
  align-items: center;
  min-height: 100%;
}

.login-left {
  flex: 5.5;
  background-image: url('@/assets/chesser.jpg');
  background-size: cover;
  background-position: center;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  color: white;
}

.login-right {
  flex: 4.5;
  display: flex;
  background-image: url('@/assets/linen-grey.jpg');
  flex-direction: column;
  justify-content: center;
  overflow-y: hidden;
  background-color:rgb(211, 211, 211);
}

.login-right div{
  position: relative;
  overflow-y: hidden;
  left: 10%;
  padding-right:20%
}

.welcome-back {
  
  max-height: 15%;
  padding-bottom:25%;
}

.login-left img {
  filter: invert(1);
  max-width: 50%;
  height: auto;
}


.welcome-text {
  margin-top:10%;
  display: inline-block;
  font-style: bold;
  font-size: 46px;
}

.welcome-text-part2 {
  font-size:16px;
}

.welcome-emoji {
  padding-left: 1%;
  display: inline-block;
  width: 42px; 
  height: 42px;
}

.info {
  max-height: 8%;
}

.infoText {
  font-size: 14px;
  color: green;
}

.form-group {
  max-height:50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.form-group input {
  background-color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  padding: 10px;
  width: 100%; 
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group input:focus {
  outline: none;
  border-color: purple;
  box-shadow: 0 0 2px purple;
}

.form-group div {
  width: 100%;
}

.submit {
  margin-top:5%;
}

.smooth-line-right {
  flex:4.5;
  background-image: url('@/assets/chesser-right.jpg');
  height:2px;
}

.smooth-line-left {
  flex:4.5;
  background-image: url('@/assets/chesser-left.jpg');
  height:2px;
}

.smooth-line-between {
  text-align: center;
  font-style: italic;
  flex:1;
}

.or-register {
  margin-top:13%;
  display: flex;
  align-items: center;
  height: 20%;
}

.forgotpass {
  text-decoration:none;
  margin-left:auto;
}

form {
    right:50%;
}


</style>