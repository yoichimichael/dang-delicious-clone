import axios from 'axios';
import { $ } from './bling';

function ajaxHeart(e){
  e.preventDefault();
  // console.log("Hearted!");
  axios
  // 'this' refers to the form element
    .post(this.action)
    .then(res => {
      // 'heart' is the name property on a child element of 'this' (the form element)
      const isHearted = this.heart.classList.toggle('heart__button--hearted');
      $('.heart-count').textContent = res.data.hearts.length;
      if(isHearted){
        this.heart.classList.add('heart__button--float');
        // use of arrow function to reference same 'this'
        setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500);
      }
    })
    .catch(console.error);
}

export default ajaxHeart;