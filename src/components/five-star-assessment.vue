<template>
  <section id="five-star-assessment">
    <div class="firstStar">
      <mu-icon :value="starStates.firstStar" :color="color" :size="size" />
    </div>
    <div class="secondStar">
      <mu-icon :value="starStates.secondStar" :color="color" :size="size" />
    </div>
    <div class="thirdStar">
      <mu-icon :value="starStates.thirdStar" :color="color" :size="size" />
    </div>
    <div class="fourthStar">
      <mu-icon :value="starStates.fourthStar" :color="color" :size="size" />
    </div>
    <div class="fifthStar">
      <mu-icon :value="starStates.fifthStar" :color="color" :size="size" />
    </div>
  </section>
</template>
<script>
  // import MuIcon from 'muse-components/icon'
  export default {
    components:{
      // MuIcon
    },
    props:{
      score: {
        required: true,
        type: Number
      },
      color: {
        required: false,
        type: String
      },
      size: {
        required: false,
        type: Number
      }
    },
    data(){
      return {
        starStates: {
          firstStar: 'star_border',
          secondStar: 'star_border',
          thirdStar: 'star_border',
          fourthStar: 'star_border',
          fifthStar: 'star_border'
        }
      }
    },
    created(){
      this.starStates = this.getStarStates(this.score)
    },
    watch:{
      'score':function(val){
        this.starStates = this.getStarStates(val)
      }
    },
    methods:{
      getStarStates(val) {
        if (val >= 100) {
          return {
            firstStar: 'star',
            secondStar: 'star',
            thirdStar: 'star',
            fourthStar: 'star',
            fifthStar: 'star'
          }
        } else if (val >= 90) {
          return {
            firstStar: 'star',
            secondStar: 'star',
            thirdStar: 'star',
            fourthStar: 'star',
            fifthStar: 'star_half'
          }
        } else if (val >= 80) {
          return {
            firstStar: 'star',
            secondStar: 'star',
            thirdStar: 'star',
            fourthStar: 'star',
            fifthStar: 'star_border'
          }
        } else if (val >= 70) {
          return {
            firstStar: 'star',
            secondStar: 'star',
            thirdStar: 'star',
            fourthStar: 'star_half',
            fifthStar: 'star_border'
          }
        } else if (val >= 60) {
          return {
            firstStar: 'star',
            secondStar: 'star',
            thirdStar: 'star',
            fourthStar: 'star_border',
            fifthStar: 'star_border'
          }
        } else if (val >= 50) {
          return {
            firstStar: 'star',
            secondStar: 'star',
            thirdStar: 'star_half',
            fourthStar: 'star_border',
            fifthStar: 'star_border'
          }
        } else if (val >= 40) {
          return {
            firstStar: 'star',
            secondStar: 'star',
            thirdStar: 'star_border',
            fourthStar: 'star_border',
            fifthStar: 'star_border'
          }
        } else if (val >= 30) {
          return {
            firstStar: 'star',
            secondStar: 'star_half',
            thirdStar: 'star_border',
            fourthStar: 'star_border',
            fifthStar: 'star_border'
          }
        } else if (val >= 20) {
          return {
            firstStar: 'star',
            secondStar: 'star_border',
            thirdStar: 'star_border',
            fourthStar: 'star_border',
            fifthStar: 'star_border'
          }
        } else if (val >= 10) {
          return {
            firstStar: 'star_half',
            secondStar: 'star_border',
            thirdStar: 'star_border',
            fourthStar: 'star_border',
            fifthStar: 'star_border'
          }
        } else {
          return {
            firstStar: 'star_border',
            secondStar: 'star_border',
            thirdStar: 'star_border',
            fourthStar: 'star_border',
            fifthStar: 'star_border'
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "../scss/variables.scss";
  #five-star-assessment {
    display: inline-block;
  }
  #five-star-assessment .firstStar,#five-star-assessment .secondStar,#five-star-assessment .thirdStar,#five-star-assessment .fourthStar,#five-star-assessment .fifthStar {
    display: inline-block;
  }
</style>
