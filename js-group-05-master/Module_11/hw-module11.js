
/*
  Реализуйте форму фильтра товаров в каталоге и список отфильтрованных товаров.
  Используйте шаблонизацию для создания карточек товаров.
  
  Есть массив объектов (дальше в задании), каждый из которых описывает 
  ноутбук с определенными характеристиками.
  
  Поля объекта по которым необходимо производить фильтрацию: size, color, release_date.
  Поля объекта для отображения в карточке: name, img, descr, color, price, release_date.
    
  Изначально есть форма с 3-мя секциями, состоящими из заголовка и группы 
  чекбоксов (разметка дальше в задании). После того как пользователь выбрал 
  какие либо чекбоксы и нажал кнопку Filter, необходимо собрать значения чекбоксов по группам. 
  
  🔔 Подсказка: составьте объект формата
      const filter = { size: [], color: [], release_date: [] }
    
  После чего выберите из массива только те объекты, которые подходят 
  под выбраные пользователем критерии и отрендерите список карточек товаров.
  
  🔔 Каждый раз когда пользователь фильтрует товары, список карточек товаров очищается, 
      после чего в нем рендерятся новые карточки товаров, соответствующих текущим критериям фильтра.
*/

/*
  HTML для формы
  <form class="form js-form">
    <section>
      <h2>Screen size</h2>
      <ul>
        <li><label><input type="checkbox" name="size" value="13"> 13"</label></li>
        <li><label><input type="checkbox" name="size" value="15"> 15"</label></li>
        <li><label><input type="checkbox" name="size" value="17"> 17"</label></li>
      </ul>
    </section>
    <section>
      <h2>Color</h2>
      <ul>
        <li><label><input type="checkbox" name="color" value="white"> white</label></li>
        <li><label><input type="checkbox" name="color" value="gray"> gray</label></li>
        <li><label><input type="checkbox" name="color" value="black"> black</label></li>
      </ul>
    </section>
    <section>
      <h2>Release date</h2>
      <ul>
        <li><label><input type="checkbox" name="release_date" value="2015"> 2015</label></li>
        <li><label><input type="checkbox" name="release_date" value="2016"> 2016</label></li>
        <li><label><input type="checkbox" name="release_date" value="2017"> 2017</label></li>
      </ul>
    </section>
    <button type="submit">Filter</button>
    <button type="reset">Clear</button>
  </form>
*/

const laptops = [
  {
    size: 13,
    color: 'white',
    price: 28000,
    release_date: 2015,
    name: 'Macbook Air White 13"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 13,
    color: 'gray',
    price: 32000,
    release_date: 2016,
    name: 'Macbook Air Gray 13"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 13,
    color: 'black',
    price: 35000,
    release_date: 2017,
    name: 'Macbook Air Black 13"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 15,
    color: 'white',
    price: 45000,
    release_date: 2015,
    name: 'Macbook Air White 15"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 15,
    color: 'gray',
    price: 55000,
    release_date: 2016,
    name: 'Macbook Pro Gray 15"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 15,
    color: 'black',
    price: 45000,
    release_date: 2017,
    name: 'Macbook Pro Black 15"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 17,
    color: 'white',
    price: 65000,
    release_date: 2015,
    name: 'Macbook Air White 17"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 17,
    color: 'gray',
    price: 75000,
    release_date: 2016,
    name: 'Macbook Pro Gray 17"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
  {
    size: 17,
    color: 'black',
    price: 80000,
    release_date: 2017,
    name: 'Macbook Pro Black 17"',
    img: 'http://demo.posthemes.com/pos_zadademo/images/placeholder.png',
    descr:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat, beatae.',
  },
];

const results = document.querySelector('.results');
const source = document.querySelector('#notebook').innerHTML.trim();
const template = Handlebars.compile(source);
const markup = template(laptops[0])
const form = document.querySelector('.js-form');

const input = {
  sizes: document.querySelectorAll(`input[name="size"]`),
  colors: document.querySelectorAll(`input[name="color"]`),
  release_date: document.querySelectorAll(`input[name="release_date"]`)
}

function UserChange (size, color, release_date){
  this.size = size;
  this.color = color;
  this.release_date = release_date;
}

form.addEventListener('submit', handleBtnFilterClick)

function createArrayValuesFromInputs(nodaList) {
  const array = Array.from(nodaList);

  return array.reduce((acc, input) => {
    if(input.checked){
      acc.push(testIsNaN(input.value))
    }

    return acc;
  }, [])
}

function testIsNaN (value) {
  if(isNaN(value)){
    return value;
  }
  
  return Number(value)
}

function handleBtnFilterClick(e) {
  e.preventDefault();

  const size = createArrayValuesFromInputs(input.sizes);
  const color = createArrayValuesFromInputs(input.colors);
  const release_date = createArrayValuesFromInputs(input.release_date);
  const userChange = new UserChange(size, color, release_date);
  const arrChange = filterByUserChecked(userChange);

  paintedUserChange(arrChange, results);
}

function paintedUserChange(array, root){
  const markup = array.reduce((acc, obj) => acc + template(obj), "");
  
  root.insertAdjacentHTML('afterbegin', markup);
}


function filteredProperty(userArray, property,sourceArray){
  const result = userArray.reduce((acc, prop) => {
    const filteredArray = sourceArray.filter(obj => obj[property] === prop)
    const  formedArray = acc.concat(filteredArray)

    return formedArray;
  }, []);

  return result;
}

function filterByUserChecked ({size, color, release_date}) {
  const arrayUserSize = filteredProperty(size, "size", laptops);
  const arrayUserColor = filteredProperty(color, "color", arrayUserSize);
  const filteredArray = filteredProperty(release_date, "release_date", arrayUserColor);
 
  return filteredArray;
}




