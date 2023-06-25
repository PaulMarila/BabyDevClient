<template>
    <NavBar />
    <div class="profile-container">
        <div class="insert-div">
            <div class="info-header">
                <p>{{ errorText }}</p>
            </div>
            <form @submit.prevent="handleSubmitForm">
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" id="title" v-model="title" :class="{ 'error': emptyField && title == ''}">
            </div>
            <div class="form-group">
                <label for="location">Location:</label>
                <input type="text" id="location" v-model="location" :class="{ 'error': emptyField && location == ''}">
            </div>
            <div class="form-group">
                <label for="experienceRequired">Experience required:</label>
                <input type="text" id="experienceRequired" v-model="experienceRequired" :class="{ 'error': emptyField && experienceRequired == ''}">
            </div>
            <div class="form-group" >
                <label for="type">Type: (eg. Part_time, Full_time, Internship)</label>
                <input type="text" id="type" v-model="type" :class="{ 'error': emptyField && type == ''}">
            </div>
            <div class="form-group">
                <label for="description">Job description:</label>
                <textarea id="description" v-model="description" :class="{ 'error': emptyField && description == '' }" maxlength="3000"></textarea>
            </div>
                <simple-button primary class="submit">Add new job</simple-button>
            </form>
            </div>
        </div>
  </template>
  
  <script>
  import NavBar from './NavBar.vue';
  import SimpleButton from './SimpleButton.vue';
  import { mapGetters, mapActions } from 'vuex';
  import router from '@/router';
  
  export default {
    computed: {
    ...mapGetters(['isLoggedIn', 'token', 'role']),
    },
    components: {
      NavBar,
      SimpleButton,
    },
    data() {
      return {
        id: '',
        title: '',
        description: '',
        location: '',
        type: '',
        experienceRequired: '',
        errorText: '',
        emptyField: false,
        submitting: false,
        editMode: false,
      };
    },
    methods: {
      ...mapActions(['logout']),
      handleSubmitForm() {
        if (this.editMode) {
          this.handleEditJob();
        } else {
          this.handleAddNewJob();
        }
      },
      async handleAddNewJob() {
        if (this.submitting) {
            return;
        }
        this.submitting = true;
        console.log("im in");
        if (!this.checkFields()) {
            this.submitting = false;
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/jobs/add', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: this.title,
                description: this.description.replace(/\n/g, '<br>'),
                location: this.location,
                type: this.type,
                experienceRequired: this.experienceRequired,
              }),
            });
            console.log(response.status);
            this.submitting = false;
            if (response.status === 200) {
              window.location.href = 'http://localhost:8081?posted=true';
            }
          } catch (error) {
            console.error('Error POSTing:', error);
          }
      },
      async handleEditJob() {
        if (this.submitting) {
            return;
        }
        this.submitting = true;
        console.log("im in");
        if (!this.checkFields()) {
            this.submitting = false;
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/jobs/editJob?jobId=' + this.id, {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${this.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: this.title,
                description: this.description.replace(/\n/g, '<br>'),
                location: this.location,
                type: this.type,
                experienceRequired: this.experienceRequired,
              }),
            });
            console.log(response.status);
            this.submitting = false;
            if (response.status === 200) {
              router.back();
            }
          } catch (error) {
            console.error('Error POSTing:', error);
          }
        },
      checkFields() {
        if (this.title == '' ||
        this.description == '' ||
        this.location == '' ||
        this.type == '' ||
        this.experienceRequired == '') {
            this.emptyField = true;
            return false;
        } else {
            return true;
        }
      },
    },
    
    
    async mounted() {
      const jobData = this.$route.query.edit;
      if (this.role !== 'RECRUITER') {
            router.push("/");
      } else if (jobData) {
        let deserializedJobData;
        try {
          deserializedJobData = JSON.parse(decodeURIComponent(jobData));
          this.title = deserializedJobData.title;
          this.location = deserializedJobData.location;
          this.experienceRequired = deserializedJobData.experienceRequired;
          this.type = deserializedJobData.type;
          console.log(deserializedJobData);
          this.description = deserializedJobData.description;
          this.id = deserializedJobData.id;
          this.editMode = true;
        } catch (error) {
          console.error('Error parsing the object:', error);
        }
      } else {
        console.log('No object in the query parameters');
      }
      },
  };
  </script>
    
  
<style scoped>

textarea {
  background-color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  padding: 10px;
  width: 100%;
  height: 150px; 
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

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