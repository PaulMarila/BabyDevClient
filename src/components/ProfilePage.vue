<template>
  <NavBar />
  <div class="profile-container">
    <ul class="tabs">
      <li v-for="tab in tabs" :key="tab.id" :class="{ active: currentTab === tab.id }" @click="changeTab(tab.id)">
        {{ tab.title }}
      </li>
    </ul>
    <div class="tab-content">
      <div v-if="currentTab === 1" class="tab-pane active">
        <h2 class="tab-title">Personal Information</h2>
        <div class="personal-info-container">
          <div class="left-side">
            <div class="image-container">
              <img class="profile-img" :src="profileImageSource" @mouseover="showUploadButton" @mouseleave="hideUploadButton" @click="openFileInput"/>
              <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" accept="image/*" />
            </div>
            <div class="smooth-line-left"> </div>
            <div class="info-details">
              <div class="info-row">
                <span class="info-label">First Name:</span>
              </div>
              <div class="info-row">
                <span class="info-label">Last Name:</span>
              </div>
              <div class="info-row">
                <span class="info-label">Email:</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone Number:</span>
              </div>
            </div>
          </div>
          <div class="right-side">
            <div class="info-header">
              <span class="info-fullname">{{ firstName }} {{ lastName }}</span>
              <br>
              <span class="info-email">{{ email }}</span>
            </div>
            <div class="smooth-line-right"></div>
            <div class="info-details">
              <div class="info-row">
                <span class="info-value">{{ firstName }}</span>
              </div>
              <div class="info-row">
                <span class="info-value">{{ lastName }}</span>
              </div>
              <div class="info-row">
                <span class="info-value">{{ email }}</span>
              </div>
              <div class="info-row">
                <span class="info-value">{{ phoneNumber }}</span>
                <button v-if="role==='STANDARD'" class="edit-button" @click="editPhoneNumber">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentTab === 2" class="tab-pane active">
        <div class="insert-div" v-if="insertMode">
          <form @submit.prevent="handleSubmitExperience">
            <div class="form-group">
              <label for="position">Position:</label>
              <input type="text" id="position" v-model="formExperience.position" required>
            </div>
            <div class="form-group">
              <label for="title">Title:</label>
              <input type="text" id="title" v-model="formExperience.title" required>
            </div>
            <div class="form-group">
              <label for="company">Company Name:</label>
              <input type="text" id="company" v-model="formExperience.companyName" required>
            </div>
            <div class="form-group">
              <label for="date-from">Date From:</label>
              <input type="date" id="date-from" v-model="formExperience.dateFrom" required>
            </div>
            <div class="form-group">
              <div class="label-date-to-wrapper">
                <label for="date-to">Date To:</label>
                <label for="actual-date-to">Until now</label>
              </div>
              <div class="date-to-wrapper">
                <input type="date" id="date-to" v-model="formExperience.dateTo" :disabled="actualDateTo">
                <input type="checkbox" id="actual-date-to" v-model="actualDateTo">
              </div>
            </div>
            <simple-button v-if="editMode" primary class="submit-form-button" @click="handleEditExperience">Save</simple-button>
            <simple-button v-else primary class="submit-form-button" @click="handleSubmitExperience">Save</simple-button>
          </form>
        </div>

        <div class="card-container" v-else>
        <div class="card-header">
          <div class="header-content">
            <h2 class="tab-title">Experience</h2>
            <img v-if="role==='STANDARD'" class="button-image" src="@/assets/plus-button.png" @click="handleAddClick" />
          </div>
        </div>
        <div class="card" v-for="item in experienceItems" :key="item.id">
          <div class="card-header">
            <span class="position-bold">{{ item.position }}</span>
            <span class="title-italic">{{ item.title }}</span>
            <div class="card-actions">
              <img v-if="role==='STANDARD'" class="card-edit" src="@/assets/edit-button.png" @click="handleEditExperienceClick(item)" />
              <img v-if="role==='STANDARD'" class="card-delete" src="@/assets/delete-button.png" @click="handleDeleteExperienceClick(item.id)" />
            </div>
          </div>
          <div class="card-content">
            <p>{{ item.companyName }}</p>
          </div>
          <div class="card-footer">
            <div class="date-from">
              <span>From: {{ item.dateFrom }}</span>
            </div>
            <div class="date-to">
              <span v-if="checkDateTo(item.dateTo)">Present</span>
              <span v-else>To: {{ item.dateTo }}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div v-if="currentTab === 3" class="tab-pane active">
        <div v-if="insertMode">
          <div class="card-container">
            <div class="skill-container" v-for="item in skillItems" :key="item.id">
              <div class="left-side-skill">
                <div class="info-details">
                  <div class="info-row">
                    <span class="info-label">Skill name: </span>
                    <input placeholder="Enter skill name..." class="profile-input" type="text" v-model="item.skillName" list="skillNamesList"/>
                  </div>
                  <div class="datalist-container">
                    <datalist id="skillNamesList">
                      <option v-for="skill in skillNames" :value="skill" :key="skill"></option>
                    </datalist>
                  </div>
                </div>
              </div>
              <div class="middle-side-skill">
                <div class="info-details">
                  <div class="info-row">
                    <span class="info-label">Level: </span>
                    <select class="profile-input" v-model="item.skillExperience">
                      <option value="" disabled selected>Select Level...</option>
                      <option value="ONE">Novice</option>
                      <option value="TWO">Beginner</option>
                      <option value="THREE">Intermediate</option>
                      <option value="FOUR">Advanced</option>
                      <option value="FIVE">Expert</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="right-side-skill">
                <img class="card-delete" src="@/assets/delete-button.png" @click="handleDeleteSkillEdit(item.id)" />
              </div>
            </div>
            <div class="add-new-skill-button">
              <img class="button-image" src="@/assets/plus-button.png" @click="handleAddNewSkill" />
            </div>
            <div class="add-new-skill">
              <simple-button primary class="skill-button" @click="handleSendNewSkills(skillItems)">Save</simple-button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="card-container">
          <div class="header-content">
            <h2 class="tab-title">Skills</h2>
            <img v-if="role==='STANDARD'" class="button-image-skill" src="@/assets/edit-button.png" @click="handleAddClick" />
          </div>
            <div class="skill-container" id="forView" v-for="item in skillItems" :key="item.id">
              <div class="left-side">
                <div class="info-details">
                  <div id="skillView" class="info-row">
                    <span class="info-label">{{ item.skillName }}</span>
                    <div id="skillView" class="smooth-line-left"></div>
                  </div>
                </div>
                
              </div>
              <div class="right-side">
                <div class="info-details">
                  <div id="skillView" class="info-row">
                    <span class="info-value">{{ getSkillLevel(item.skillExperience) }}</span>
                    <div id="skillView" class="smooth-line-right"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentTab === 4" class="tab-pane active">
        <div class="insert-div" v-if="insertMode">
          <form @submit.prevent="handleSubmitEducation">
            <div class="form-group">
              <label for="institution">Institution:</label>
              <input type="text" id="institution" v-model="formEducation.institution" required>
            </div>
            <div class="form-group">
              <label for="subject">Subject:</label>
              <input type="text" id="subject" v-model="formEducation.subject" required>
            </div>
            <div class="form-group">
              <label for="degree">Degree:</label>
              <select id="education" class="profile-input" v-model="formEducation.degree" required>
                <option value="" disabled selected>Select degree...</option>
                <option value="HIGH_SCHOOL_GRADUATION_DIPLOMA">High School Diploma</option>
                <option value="BACHELOR">Bachelor's Degree</option>
                <option value="MASTER">Master's Degree</option>
              </select>
            </div>
            <div class="form-group">
              <label for="date-from">Date From:</label>
              <input type="date" id="date-from" v-model="formEducation.dateFrom" required>
            </div>
            <div class="form-group">
              <div class="label-date-to-wrapper">
                <label for="date-to">Date To:</label>
                <label for="actual-date-to">Until now</label>
              </div>
              <div class="date-to-wrapper">
                <input type="date" id="date-to" v-model="formEducation.dateTo" :disabled="actualDateTo">
                <input type="checkbox" id="actual-date-to" v-model="actualDateTo">
              </div>
            </div>
            <simple-button v-if="editMode" primary class="submit-form-button" @click="handleEditEducation">Save</simple-button>
            <simple-button v-else primary class="submit-form-button" @click="handleSubmitEducation">Save</simple-button>
          </form>
        </div>

        <div class="card-container" v-else>
        <div class="card-header">
          <div class="header-content">
            <h2 class="tab-title">Education</h2>
            <img v-if="role==='STANDARD'" class="button-image" src="@/assets/plus-button.png" @click="handleAddClick" />
          </div>
        </div>
        <div class="card" v-for="item in educationItems" :key="item.id">
          <div class="card-header">
            <span class="position-bold">{{ getDegreeLevel(item.degree) }}</span>
            <span class="title-italic">{{ item.subject }}</span>
            <div class="card-actions">
              <img v-if="role==='STANDARD'" class="card-edit" src="@/assets/edit-button.png" @click="handleEditEducationClick(item)" />
              <img v-if="role==='STANDARD'" class="card-delete" src="@/assets/delete-button.png" @click="handleDeleteEducationClick(item.id)" />
            </div>
          </div>
          <div class="card-content">
            <p>{{ item.institution }}</p>
          </div>
          <div class="card-footer">
            <div class="date-from">
              <span>From: {{ item.dateFrom }}</span>
            </div>
            <div class="date-to">
              <span v-if="checkDateTo(item.dateTo)">Present</span>
              <span v-else>To: {{ item.dateTo }}</span>
            </div>
          </div>
        </div>
        </div>
      </div>
      <div style="overflow-y: hidden" v-if="currentTab === 5" class="tab-pane active">
        <h2 class="tab-title">Curriculum Vitae</h2>
        <div class="cv-container" v-if="hasCv">
          <div class="cv-actions">
            <simple-button class="cv-button" primary @click="downloadFile">View</simple-button>
            <a v-if="role==='STANDARD'" class="delete-link" @click="deleteCV">Delete CV</a>
          </div>
        </div>
        <div class="cv-container" v-else>
          <div v-if="role==='STANDARD'" class="cv-upload">
            <input ref="fileInputCV" type="file" style="display: none" @change="uploadFile" accept="application/pdf"/>
            <simple-button class="cv-button" primary @click="openFileExplorerForUploadCV">Upload</simple-button>
          </div>
          <div v-if="role==='STANDARD'" class="cv-upload">
            <simple-button class="cv-button" primary @click="generateCV">Generate CV</simple-button>
          </div>
          <div v-if="role==='STANDARD'" class="cv-upload">
            <input ref="fileReadCV" type="file" style="display: none" @change="readPdf" accept="application/pdf"/>
            <simple-button class="cv-button" primary @click="openFileExplorerForReadingCV">Fill profile information from CV</simple-button>
          </div>          
          <div v-else class="cv-upload">
            <p style="margin-left:20px;">This user did not upload a resume.</p>
          </div>  
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './NavBar.vue';
import SimpleButton from './SimpleButton.vue';
import { mapGetters, mapActions } from 'vuex';
import router from '@/router';
import store from '@/store';

export default {
  computed: {
  ...mapGetters(['isLoggedIn', 'token', 'role', 'id']),
  profileImageSource() {
    return this.photo ? 'data:image/png;base64,' + this.photo : require('@/assets/profile-default.png');
  },
  },
  components: {
    NavBar,
    SimpleButton,
  },
  data() {
    return {
      currentTab: 1,
      tabs: [
        { id: 1, title: 'Personal Information' },
        { id: 2, title: 'Experience' },
        { id: 3, title: 'Skills' },
        { id: 4, title: 'Education' },
        { id: 5, title: 'Curriculum Vitae' },
      ],
      showUpload: false,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      photo: '', 
      hasCv: false,
      experienceItems: [],
      skillNames: [],
      skillItems: [],
      educationItems: [],
      editMode: false,
      insertMode: false,
      submitting: false,
      personalInfoPath: '',
      formExperience: {
        id: '',
        position: '',
        title: '',
        companyName: '',
        dateFrom: '',
        dateTo: ''
      },
      formEducation: {
        id: '',
        institution: '',
        subject: '',
        degree: '',
        dateFrom: '',
        dateTo: ''
      },
      actualDateTo: false,
      file: null,
      downloadLink: '',
    };
  },
  methods: {
    ...mapActions(['setPhoto']),
    async changeTab(tabId) {
      this.currentTab = tabId;
      this.editMode = false;
      this.insertMode = false;
      this.submitting = false;
      switch(tabId) {
        case 1: 
          await this.fetchTab1(false);
          break;
        case 2:
          await this.fetchTab2();
          break;
        case 3:
          await this.fetchTab3();
          break;
        case 4:
          await this.fetchTab4();
          break;
        case 5:
          await this.fetchTab5();
          break;
      }
    },
    getSkillLevel(value) {
      switch(value) {
        case "ONE":
          return "Novice";
        case "TWO":
          return "Beginner";
        case "THREE":
          return "Intermediate";
        case "FOUR":
          return "Advanced";
        case "FIVE":
          return "Expert";
      }
    },
    getDegreeLevel(value) {
      switch(value) {
        case "HIGH_SCHOOL_GRADUATION_DIPLOMA":
          return "High School Diploma";
        case "BACHELOR":
          return "Bachelor's Degree";
        case "MASTER":
          return "Master's Degree";
      }
    },
    handleDeleteSkillEdit(id) {
      const index = this.skillItems.findIndex(item => item.id === id);
      if (index !== -1) {
        this.skillItems.splice(index, 1);
      }
    },
    handleAddNewSkill() {
      this.skillItems.push({
      skillName: '',
      skillExperience: ''
    });
    },
    async handleSendNewSkills(skillItems) {
      console.log(JSON.stringify(skillItems));
      if (this.submitting) {
        return;
      }
      
      this.submitting = true;
      try {
            await fetch('http://localhost:8080/api/qualifications/skill?email=' + this.email, {
              method: 'PUT',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
              },
              body: JSON.stringify(skillItems),
            });
          } catch (error) {
            console.error('Error sending request:', error);
          }
          this.submitting = false;
      this.changeTab(3);
    },
    showUploadButton() {
      this.showUpload = true;
    },
    hideUploadButton() {
      this.showUpload = false;
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    checkDateTo(dateTo) {
      return dateTo === "until present" 
    },
    async handleFileUpload(event) {
      if (!event.target.files[0]) {
        return;
      }
      this.photo = event.target.files[0];
      const blob = await this.testImageRenderFromBlob();
      try {
        const response = await fetch('http://localhost:8080/api/users/image', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.token}`, 
            'Content-Type': 'application/octet-stream'
          },
          body: blob,
        });
        if (response.status === 200) {
          this.fetchTab1(true);
        }
      } catch (error) {
        console.error('Error uploading photo:', error);
      }
    },
    async blobFromImage() {
      return new Blob([await new Response(this.photo).arrayBuffer()], { type: this.photo.name });
    },

    async testImageRenderFromBlob() {
      var blob = await this.blobFromImage();
      const array = new Uint8Array(await blob.arrayBuffer());
      return array;
    },
    async editPhoneNumber() {
      const newPhoneNumber = prompt('Enter a new phone number');
      if (newPhoneNumber) {
        try {
          await fetch('http://localhost:8080/api/users/phoneno', {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${this.token}`, 
              'Content-Type': 'application/octet-stream'
            },
            body: newPhoneNumber,
          });
        } catch (error) {
          console.error('Error uploading photo:', error);
        }
        this.phoneNumber = newPhoneNumber;
      }
    },
    async fetchTab1(afterUpdate) {
      try {
        const response = await fetch(this.personalInfoPath, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      
        const data = await response.json();
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        this.photo = data.imageData;
        if (afterUpdate) {
          store.commit('setPhoto', this.photo);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async handleDeleteExperienceClick(id){
      if (!confirm("Are you sure you want to delete this experience?")) {
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/api/qualifications/experience?email=' + this.email + '&id=' + id, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      if (response.status === 200) {
        this.fetchTab2();
      }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      
    },
    async handleDeleteEducationClick(id){
      if (!confirm("Are you sure you want to delete this education?")) {
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/api/qualifications/education?email=' + this.email + '&id=' + id, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      if (response.status === 200) {
        this.fetchTab4();
      }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
      
    },
    handleAddClick() {
      this.resetForm(true);
      this.resetForm(false);
      this.insertMode = true;
    },
    async handleSubmitExperience() {
      if (this.submitting) {
        return;
      }
      this.submitting = true;
      console.log(this.formExperience.dateFrom);
      let formatedDateFrom;
      let formatedDateTo;
      
      if (this.actualDateTo) {
        formatedDateTo = '';
      } else {
        formatedDateTo = this.formatDate(this.formExperience.dateTo);
      }

      formatedDateFrom = this.formatDate(this.formExperience.dateFrom);
        try {
            await fetch('http://localhost:8080/api/qualifications/experience', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
              },
              body: JSON.stringify({
                position: this.formExperience.position,
                title: this.formExperience.title,
                companyName: this.formExperience.companyName,
                dateFrom: formatedDateFrom,
                dateTo: formatedDateTo
              }),
            });
          } catch (error) {
            console.error('Error POSTing:', error);
          }
        
      
      this.resetForm(true);
      this.changeTab(2);
    },
    async handleSubmitEducation() {
      if (this.submitting) {
        return;
      }

      let formatedDateFrom;
      let formatedDateTo;
      this.submitting = true;
      if (this.actualDateTo) {
        formatedDateTo = '';
      } else {
        formatedDateTo = this.formatDate(this.formEducation.dateTo);
      }

      formatedDateFrom = this.formatDate(this.formEducation.dateFrom);

        try {
            await fetch('http://localhost:8080/api/qualifications/education', {
              method: 'POST',
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
              },
              body: JSON.stringify({
                institution: this.formEducation.institution,
                subject: this.formEducation.subject,
                degree: this.formEducation.degree,
                dateFrom: formatedDateFrom,
                dateTo: formatedDateTo
              }),
            });
          } catch (error) {
            console.error('Error POSTing:', error);
          }
      
      this.resetForm(false);
      this.changeTab(4);
    },
    async handleEditExperience() {
      let formatedDateFrom;
      let formatedDateTo;
      
      if (this.actualDateTo) {
        formatedDateTo = '';
      } else {
        formatedDateTo = this.formatDate(this.formExperience.dateTo);
      }

      formatedDateFrom = this.formatDate(this.formExperience.dateFrom);

      if (this.submitting) {
        return;
      }
      
      this.submitting = true;
      try {
          await fetch('http://localhost:8080/api/qualifications/experience?email=' + this.email, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({
              id: this.formExperience.id,
              position: this.formExperience.position,
              title: this.formExperience.title,
              companyName: this.formExperience.companyName,
              dateFrom: formatedDateFrom,
              dateTo: formatedDateTo
            }),
          });
        } catch (error) {
          console.error('Error edit experience:', error);
        }
        this.resetForm(true);
        this.changeTab(2);
    },
    async handleEditEducation() {
      if (this.submitting) {
        return;
      }

      let formatedDateFrom;
      let formatedDateTo;
      this.submitting = true;
      if (this.actualDateTo) {
        formatedDateTo = '';
      } else {
        formatedDateTo = this.formatDate(this.formEducation.dateTo);
      }

      formatedDateFrom = this.formatDate(this.formEducation.dateFrom);

      console.log(formatedDateFrom);
      console.log(formatedDateTo);
      try {
          await fetch('http://localhost:8080/api/qualifications/education?email=' + this.email, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({
              id: this.formEducation.id,
              institution: this.formEducation.institution,
              subject: this.formEducation.subject,
              degree: this.formEducation.degree,
              dateFrom: formatedDateFrom,
              dateTo: formatedDateTo
            }),
          });
        } catch (error) {
          console.error('Error edit education:', error);
        }
        this.resetForm(false);
        this.changeTab(4);
    },
    handleEditEducationClick(education) {
      this.formEducation.id = education.id;
      this.formEducation.institution = education.institution;
      this.formEducation.subject = education.subject;
      this.formEducation.degree = education.degree;
      this.formEducation.dateFrom = this.formatDate(education.dateFrom);
      if (education.dateTo === "until present") {
        this.actualDateTo = true;
      } else {
        this.formEducation.dateTo = this.formatDate(education.dateTo);
      }
      this.insertMode = true;
      this.editMode = true;
      
    },
    handleEditExperienceClick(experience) {
      this.formExperience.id = experience.id;
      this.formExperience.companyName = experience.companyName;
      this.formExperience.position = experience.position;
      this.formExperience.title = experience.title;
      this.formExperience.dateFrom = this.formatDate(experience.dateFrom);
      if (experience.dateTo === "until present") {
        this.actualDateTo = true;
      } else {
        this.formExperience.dateTo = this.formatDate(experience.dateTo);
      }
      this.insertMode = true;
      this.editMode = true;
      
    },
    resetForm(isExperience) {
      if (isExperience) {
        this.formExperience.position = '';
        this.formExperience.title = '';
        this.formExperience.companyName = '';
        this.formExperience.dateFrom = '';
        this.formExperience.dateTo = '';
      } else {
        this.formEducation.id = '';
        this.formEducation.position = '';
        this.formEducation.title = '';
        this.formEducation.dateFrom = '';
        this.formEducation.dateTo = '';
      }
      this.actualDateTo = false;
    },
    // change days with years as follows:
    // dd-MM-yyyy => yyyy-MM-dd
    // yyyy-MM-dd => dd-MM-yyyy
    formatDate(dateString) {
      var dateParts = dateString.split('-');
      return dateParts[2] + '-' + dateParts[1] + '-' + dateParts[0];
    },
    async fetchTab2() {
      try {
        const response = await fetch('http://localhost:8080/api/qualifications/experience?email=' + this.email, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      
        this.experienceItems = await response.json();
        console.log(this.experienceItems);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async fetchTab3() {
      try {
        const response = await fetch('http://localhost:8080/api/qualifications/skill?email=' + this.email, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
        const skillsResponse = await response.json();
        this.skillItems = skillsResponse.skills;
        this.skillNames = skillsResponse.skillNames;
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async fetchTab4() {
      try {
        const response = await fetch('http://localhost:8080/api/qualifications/education?email=' + this.email, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      
        this.educationItems = await response.json();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async fetchTab5() {
      try {
        const response = await fetch('http://localhost:8080/api/users/hasCv?email=' + this.email, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      
        this.hasCv = await response.json();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    openFileExplorerForUploadCV() {
      if (this.submitting) {
        return;
      }
      
      this.submitting = true;
      this.$refs.fileInputCV.click();
      console.log("open");
      
    },
    openFileExplorerForReadingCV() {
      if (this.submitting) {
        return;
      }
      
      this.submitting = true;
      this.$refs.fileReadCV.click();
      console.log("open");
      
    },
    async generateCV() {
      if (this.isSubmitting) {
        return;
      }

      this.isSubmitting = true;

      try {
  
        const response = await fetch('http://localhost:8080/api/cv/generate?email=' + this.email, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
  
        if (response.ok) {
          this.hasCv=true;
        } else {
          console.error('File upload failed:', response.statusText);
        }
      } catch (error) {
        console.error('File upload failed:', error);
      }
      this.submitting = false;
    },
    async uploadFile(event) {
      this.file = event.target.files[0];

      if (!this.file) {
        return;
      }
      
      try {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('email', this.email);
  
        const response = await fetch('http://localhost:8080/api/cv/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          body: formData
        });
  
        if (response.ok) {
          this.hasCv=true;
        } else {
          console.error('File upload failed:', response.statusText);
        }
      } catch (error) {
        console.error('File upload failed:', error);
      }
      this.submitting = false;
    },
    async readPdf(event) {
      this.file = event.target.files[0];

      if (!this.file) {
        return;
      }
      
      try {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('email', this.email);
  
        const response = await fetch('http://localhost:8080/api/cv/read', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          body: formData
        });
  
        if (response.ok) {
          console.log("OK");
          this.fetchTab1(false);
        } else {
          console.error('File upload failed:', response.statusText);
        }
      } catch (error) {
        console.error('File upload failed:', error);
      }
      this.submitting = false;
    },
    async downloadFile() {
      try{
      const response = await fetch('http://localhost:8080/api/cv/download?email=' + this.email, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        if (response.ok) {
        const url = URL.createObjectURL(await response.blob());
        window.open(url, '_blank');
      } else {
        console.error('File download failed:', response.statusText);
      }
      } catch (error) {
        console.error('File download failed:', error);
      }
    
    },
    triggerFileDownload() {
      const link = document.createElement('a');
      link.href = this.downloadLink;
      link.download = this.getFileNameFromLink(this.downloadLink);
      link.click();
    },
    getFileNameFromLink(link) {
      const segments = link.split('/');
      return segments[segments.length - 1];
    },
    async deleteCV() {
      if (!confirm("Are you sure you want to delete the CV?")) {
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/api/cv?email=' + this.email, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        if (response.ok) {
        this.hasCv = false;
       
      } else {
        console.error('File download failed:', response.statusText);
      }
      } catch (error) {
        console.error('File download failed:', error);
      }
    }
  },
  
  
  async mounted() {
      const id = this.$route.params.id;
      if (!this.isLoggedIn) {
        router.push('/login');
      } else if (this.$route.path === '/myprofile') {
        if (this.role !== 'STANDARD') {
          router.push('/')
        } else {
          this.personalInfoPath = 'http://localhost:8080/api/users/myprofile';
          await this.fetchTab1(false);
          return;
        }
      } else if (id) {
        if (id === this.userId) {
          this.personalInfoPath = 'http://localhost:8080/api/users/myprofile';
          await this.fetchTab1(false);
          return;
        } else if (this.role !== 'STANDARD') {
          this.personalInfoPath = 'http://localhost:8080/api/users/profile/' + id;
          await this.fetchTab1(false);
          return;
        }
      }
    },
};
</script>
  

  
  <style scoped>
.profile-container {
  max-width: 90%;
  max-height: 80%;
  background-color: white;
  margin: 2% auto;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow-y: hidden;
}

.skill-button {
  margin-top:30px;
}

.add-new-skill {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height:100px;
}

.add-new-skill-button {
  margin-top:30px;
  display: flex;
  justify-content: right;
  align-items: center;
  max-height:50px;
}

.add-new-skill-button img {
  margin-right:100px;
}

.tabs {
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.tabs li {
  flex-grow: 1;
  text-align: center;
  padding: 10px 0;
  background-color: #f2f2f2;
  cursor: pointer;
}

.tabs li.active {
  background-color: #ccc;
}

.tab-content {
  margin-top: 5px;
}

.tab-pane {
    display: none;
}

.tab-pane.active {
  display: block;
}

.personal-info-container {
  max-height: 80%;
  display: flex;
  overflow-y: hidden;
}

.skill-container {
  max-height: 80px;
  display: flex;
  overflow-y: hidden;
}

#forView.skill-container {
  max-height: 60px;
}

.left-side-skill {
  flex: 4.5;
  padding: 20px;
  overflow-y:hidden;
}

.left-side {
  flex: 5;
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow-y:hidden;
}

.tab-title {
  padding: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  max-height:100px;
}

.button-image {
  width: 35px; 
  height: 35px; 
  margin-left:1265px;
  cursor: pointer;
  /* filter: hue-rotate(30deg); */
  filter: hue-rotate(45deg);
}

.button-image-skill {
  width: 30px; 
  height: 30px; 
  margin-left:1360px;
  cursor: pointer;
}

.right-side {
  flex: 5;
  padding-right: 20px;
  padding-bottom: 20px;
  padding-top:20px;
  overflow-y: hidden;
}

.middle-side-skill {
  flex: 4.5;
  padding: 20px;
  overflow-y: hidden;
}

.right-side-skill {
  flex: 1;
  padding: 20px;
  overflow-y: hidden;
}

.right-side-skill img {
  width:25px;
  height:25px;
  margin-top:27px;
  margin-left:30px;
}

.image-container {
  padding-left: 250px;
  max-height: 200px;
  position: relative;
  overflow-y: hidden;
  display: inline-block;
}

.upload-button {
  height: 200px;
  width: 200px;
  border-radius: 50%;
}

.info-header {
  max-height: 200px;
  position: relative;
  overflow-y: hidden;
  display: inline-block;
}

.profile-img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #000; 
}


.profile-img:hover {
  background-color: #333;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.info-details {
  margin-top: 20px;
  overflow-y: hidden;
}

.info-row {
  display: flex;
  max-height: 50px;
  align-items: center;
  margin-bottom: 3px;
  overflow-y:hidden;
}

#skillView.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 3px;
  overflow-y: hidden;
  position: relative;
}

.info-label {
  font-weight: bold;
  margin-right: 10px;
}

.edit-button {
  margin-left: 10px;
  background: none;
  border: none;
  color: #333;
  text-decoration: underline;
  cursor: pointer;
}

.edit-button:hover {
  color: #555;
}

.info-fullname {
  font-size: 46px;
}

.info-email {
  font-size: 28px;
  font-style: italic;
}

.position-bold {
  font-weight: bold;
  margin-right: 20px;
}

.title-italic {
  font-style: italic;
}

.card {
  border: 1px solid blueviolet;
  background-color: rgba(220, 220, 220, 0.356);
  border-radius: 5px;
  margin: 10px;
  overflow-y: auto;
  max-height: 200px; 
}

.card-container {
  overflow-y: auto;
  max-height: calc(100vh - 230px);
}

.card-header {
  display: flex;
  margin-bottom: 10px;
  max-height: 100px;
}

.card-actions {
  margin-left:auto;
}

.card-edit { 
  width: 20px; 
  height: 20px; 
  margin-right: 20px;
  margin-bottom:2px;
  cursor: pointer;
}

.card-delete {
  width: 20px; 
  height: 20px; 
  margin-right:3px;
  cursor: pointer;
}

.card-content p {
  margin-left: 10px;
  margin-bottom: 10px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #888;
}

.date-from, .date-to {
  display: flex;
  align-items: center;
}

.profile-input {
  background-color: rgba(255, 255, 255, 0.5);
  max-height: 35px;
  font-size: 16px;
  margin-left:50px;
  width: 100%; 
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#education.profile-input {
  margin-left:0px;
  padding:10px;
  max-height: 50px;
}
.profile-input:focus {
  outline: none;
  border-color: purple;
  box-shadow: 0 0 2px purple;
}

.form-group {
  display: flex;
  padding-left:5%;
  padding-right:10%;
}

.date-to-wrapper {
  display: flex;
  align-items: center;
}

.date-to-wrapper input[type="date"] {
  flex: 93%;
  margin-right:40px;
}

.date-to-wrapper input[type="date"]:disabled {
  background-color: rgba(128, 0, 128, 0.1);
}

.date-to-wrapper input[type="checkbox"] {
  max-width: 14px;
  margin-right:40px;
  transform: scale(3);
  flex: 7%;
  color: purple;
}

.date-to-wrapper input[type="checkbox"]:focus {
    outline: none;
    border-color: none;
    box-shadow: none;
}

div.date-to-wrapper input[type="checkbox"]:checked {
  color: purple;
}

.label-date-to-wrapper {
  display: flex;
  justify-content: space-between;
}

.label-date-to-wrapper label {
  margin-right:10px;
}

.form-group label {
  font-size:18px;
}

.cv-actions {
  
  display: inline;
}

.cv-button {
  width: 300px;
  margin-left:25px;
  margin-right: 30px; 
}

.submit-form-button {
  margin-top:20px;
  width: 85%;
  margin-left:5%; 
}

.cv-container {
  padding-top:50px;
  max-height: 500px;
}

.delete-link {
  text-decoration: none;
}
.delete-link:hover {
  color: purple; 
  cursor: pointer; 
}

.smooth-line-left {
  margin-top:30px;
  background-image: url('@/assets/chesser-left.jpg');
  height:2px;
}

#skillView.smooth-line-left {
  position: absolute; 
  left: 0;
  margin-top:0px;
  bottom: 0; 
  width: 100%; 
  height: 0.5px;
  background-image: url('@/assets/chesser-left.jpg');
}

.smooth-line-right {
  margin-top:30px;
  background-image: url('@/assets/chesser-right.jpg');
  height:2px;
}

#skillView.smooth-line-right {
  position: absolute; 
  left: 0;
  margin-top:0px;
  bottom: 0; 
  width: 100%; 
  height: 0.5px;
  background-image: url('@/assets/chesser-right.jpg');
}

.insert-div {
  max-height:80%;
  overflow-y: hidden;
  margin-top:30px;
}

.insert-div label {
  margin-top:5px;
  margin-bottom: 2px;
}

.insert-div simple-button {
  width:50%;
}

.cv-upload {
  max-height: 80px;
}
</style>