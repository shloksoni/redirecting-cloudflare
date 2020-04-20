
export default class ElementHandler {
  element(element) {
    // An incoming element, such as `div`
    console.log(element.tagName);
    if(element.tagName == 'title'){
      element.setInnerContent("shlok");
     
    }
  }

  comments(comment) {
    // An incoming comment
  }

  text(text) {
    // An incoming piece of text
  }