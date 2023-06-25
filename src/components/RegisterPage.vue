<script>
  import SimpleButton from './SimpleButton.vue';
  import { mapGetters, mapActions } from 'vuex';
  import store from '@/store';
  import router from '@/router';
  
  export default {
    computed: {
    ...mapGetters(['isLoggedIn']),
    isPasswordMismatch() {
      return this.password !== this.confirmPassword;
    }
    },
    components: {
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
        infoText: '',
        emptyField: false,
        isSubmitting: false,
      };
    },
    methods: {
      ...mapActions(['logout']),
      async handleRegister() {
        if (this.submitting) {
            return;
        }
        document.body.classList.add('loading-cursor');
        this.isSubmitting = true;
        console.log("im in");
        if (!this.checkFields()) {
            this.$nextTick(() => {
                    const registerRight = this.$refs.registerRight;
                    registerRight.scrollTop = 0;
                });
            this.isSubmitting = false;
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: this.email,
                password: this.password,
                firstName: this.firstName,
                lastName: this.lastName,
                phoneNumber: this.phoneNumber
              }),
            });
            document.body.classList.remove('loading-cursor');
            switch (response.status) {
                case 200:
                    router.push({path: "/login", query: { redirected: true} });
                    break;
                case 409: 
                    this.infoText = "There is already an account with this email.";
                    break;
                case 403: 
                    this.infoText = "This is not a valid email address.";
                    break;
                case 417: 
                    this.infoText = "Password must have 8 characters, one special, one uppercase and one digit.";
                    break;
                case 425:
                    this.infoText = "Verify your account and log in";
                    break;
            }

            if (response.status !== 200) {
                this.$nextTick(() => {
                    const registerRight = this.$refs.registerRight;
                    registerRight.scrollTop = 0;
                });
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
            this.infoText = "Please fill in all fields";
            return false;
        } else {
            return true;
        }
      },
      validatePhoneNumber() {
        this.phoneNumber = this.phoneNumber.replace(/\D/g, '');
    },
        handleClickLogin() {
            router.push("/login");
        },
        handleClickRegisterAsRecruiter() {
          router.push("/recruiter/register")
        },
    },
    
    
    async mounted() {
        if (this.isLoggedIn) {
          store.commit('logout');
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
    <div class="register-right" ref="registerRight">
      <div class="welcome-back">
        <p class="welcome-text">Sign up</p>
        <img class="welcome-emoji" src="@/assets/sign-up.png">
        <p class="welcome-text-part2">Take steps towards finding your dream job now.</p>
      </div>
      <div class="info">
        <p class="infoText">{{ infoText }}</p>
      </div>
      <form @submit.prevent="handleRegister">
            <div id="register" class="form-group">
                <label for="firstName">First name:</label>
                <input type="text" id="firstName" v-model="firstName" :class="{ 'error': emptyField && firstName == ''}">
            </div>
            <div id="register" class="form-group">
                <label for="lastName">Last name:</label>
                <input type="text" id="lastName" v-model="lastName" :class="{ 'error': emptyField && lastName == ''}">
            </div>
            <div id="register" class="form-group">
                <label for="email">Email address:</label>
                <input type="text" id="email" v-model="email" :class="{ 'error': emptyField && email == ''}">
            </div>
            <div id="register" class="form-group">
                <label for="phoneNumber">Phone number:</label>
                <input type="text" id="phoneNumber" @input="validatePhoneNumber" v-model="phoneNumber" :class="{ 'error': emptyField && phoneNumber == ''}">
            </div>
            <div id="register" class="form-group" >
                <label for="password">Password:</label>
                <input type="password" id="password" v-model="password" :class="{ 'error': emptyField && password == ''}">
            </div>
            <div id="register" class="form-group">
                <label for="password">Confirm password:</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" :class="{ 'error': confirmPassword != '' && isPasswordMismatch && !confirmPasswordFocused }" @focus="confirmPasswordFocused = true" @blur="confirmPasswordFocused = false">
            </div>
            <div id="register" class="form-group">
                <simple-button primary class="submit">Sign up</simple-button>
                <simple-button class="submit" secondary @click="handleClickLogin">Sign in</simple-button>
            </div>
        </form>
      <div class="or-login">
        <hr class="smooth-line-left">
        <p class="smooth-line-between">or</p>
        <hr class="smooth-line-right">
      </div>
      <div class="to-login-button">
          <simple-button class="submit" primary @click="handleClickRegisterAsRecruiter">Register as recruiter</simple-button>
      </div>
      
    </div>
  </div>
</template>

<style>

.loading-cursor {
  cursor: wait;
}

.error {
    background-color: #ffcccc !important; 
    border: 1px solid #ff0000 !important; 
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

.register-right {
  flex: 4.5;
  background-image: url('@/assets/linen-grey.jpg');
  background-color:rgb(211, 211, 211);
}

.register-right div{
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
    margin-bottom: 20px;
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
  color: red;
}

#register.form-group {
margin-top:40px;
  max-height:50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#register.form-group input {
  background-color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  padding: 10px;
  width: 100%; 
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#register.form-group input:focus {
  outline: none;
  border-color: purple;
  box-shadow: 0 0 2px purple;
}

#register.form-group div {
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

.or-login {
    margin-top:30px;
  display: flex;
  align-items: center;
  height: 10%;
}

form {
    right:50%;
}

.to-login-button {
    max-height: 200px;
}


</style>