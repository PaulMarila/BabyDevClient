<template>
    <button :class="buttonClass" @click="handleClick">
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    name: "SimpleButton",
    props: {
      primary: {
        type: Boolean,
        default: false,
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {};
    },
    methods: {
      handleClick() {
        this.$emit("click");
      },
    },
    computed: {
      buttonClass() {
        return {
          "simple-button": true,
          "simple-button-primary": this.primary,
          "simple-button-disabled": this.disabled,
        };
      },
    },
  };
  </script>
  
  <style>
  .simple-button {
    border: 1px solid #000;
    position:relative;
    border-radius: 8px;
    padding: 10px;
    font-size: 16px;
    width: 100%;
  }
  
  .simple-button-primary {
    background-image: url('@/assets/chesser.jpg');
    cursor: pointer;
    background-size: cover;
    background-position: center;
    color: #fff;
    transition: filter 0.3s;
  }
  
  .simple-button-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .simple-button:hover {
    filter: brightness(130%);
}

  </style>