/*
  Написать приложение для работы с REST сервисом, 
  все функции делают запрос и возвращают Promise 
  с которым потом можно работать. 
  
  Реализовать следующий функционал:
  - функция getAllUsers() - должна вернуть текущий список всех пользователей в БД.
  
  - функция getUserById(id) - должна вернуть пользователя с переданным id.
  
  - функция addUser(name, age) - должна записывать в БД юзера с полями name и age.
  
  - функция removeUser(id) - должна удалять из БД юзера по указанному id.
  
  - функция updateUser(id, user) - должна обновлять данные пользователя по id. 
    user это объект с новыми полями name и age.
  Документацию по бэкенду и пример использования прочитайте 
  в документации https://github.com/trostinsky/users-api#users-api.
  Сделать минимальный графический интерфейс в виде панели с полями и кнопками. 
  А так же панелью для вывода результатов операций с бэкендом.
*/

const api = {
  baseURL: `https://test-users-api.herokuapp.com/users/`,
  getAllUsers() {
    return fetch(this.baseURL)
      .then(response => {
        if (response.ok) return response.json();

        throw new Error(`Error in response ${response.statusText}`)
      })

      .then(obj => obj.data)
      .catch(error => alert(error))
  },

  addUser(user) {
    return fetch(this.baseURL, {
        method: 'POST',
        body: JSON.stringify(user),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      })
      .then(response => {
        if (response.ok) return response.json();

        throw new Error(`Error in response ${response.statusText}`)
      })
      .then(obj => obj.data)
      .then(({ _id: id, ...rest }) => ({ id, ...rest }))
      .catch(error => alert(error))
  },

  deleteUser(id) {
    return fetch(`${this.baseURL}${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) throw new Error('Неполучилось удалить!!!');
      })
      .catch(error => alert(error))
  },

  getUserById(id) {
    return fetch(`${this.baseURL}${id}`, {
        method: 'GET',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      })
      .then(response => {
        if (response.ok) return response.json();

        throw new Error('Error while fetching ' + response.statusText);
      })
      .then(obj => obj.data)
      .catch(error => alert(error))
  },

  updateUser(user) {
    return fetch(`${this.baseURL}${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {
          'Content-type': 'application/json',
        },
      })
      .then(response => {
        if (response.ok) return response.json();

        throw new Error('Error while fetching ' + response.statusText);
      })

      .catch(error => alert(error))
  },
}

document.addEventListener('DOMContentLoaded', () => {
  const refs = selectRefs();

  //----------------------------Listener----------------------------------------------------------------------
  refs.form.addEventListener('submit', handleBtnAddUser);
  refs.allUserBtn.addEventListener('click', handleBtnGetAllUser);
  refs.postWrapper.addEventListener('click', handleBtnPostClick);
  refs.backdropModal.addEventListener('click', handleBtnModalClick);
  //--------------------------------------------------------------------------------------------------
  function User(name, age) {
    this.name = name;
    this.age = age;
  }

  function handleBtnGetAllUser() {
    api.getAllUsers()
      .then(array => {
        const markUp = paintedAllUserInArray(array);

        refs.postWrapper.insertAdjacentHTML("beforeend", markUp)
      })
  }

  function paintedAllUserInArray(arr) {
    return arr.reduce((acc, user) =>
      acc + createPostUser(user), '');
  }

  function handleBtnAddUser(e) {
    e.preventDefault();

    const user = createUserInValueInput(refs.userInput);

    api.addUser(user)
      .then(user => {
        const post = createPostUser(user);

        refs.postWrapper.insertAdjacentHTML("afterbegin", post)
      })

    refs.form.reset();
  }

  function handleBtnModalClick(e) {
    e.preventDefault();

    modalEditUser(e)
  }

  function handleBtnPostClick({ target }) {
    if (target.nodeName !== "BUTTON") return;

    const action = target.dataset.action;

    switch (action) {
      case 'delete':
        deleteUserPost(target);
        break;
      case 'edit':
        editUserStart(target)
        break;
      default:
        throw new Error('Unrecognized action type ' + action);
    }
  }

  function modalEditUser({ target }) {
    if (target.nodeName !== "BUTTON") return;

    const action = target.dataset.action;

    switch (action) {
      case 'save':
        editUserSave();
        break;
      case 'cancel':
        toggleModal();
        break;
      default:
        throw new Error('Unrecognized action type ' + action);
    }
  }

  function editUserStart(target) {
    const editPost = target.closest('.post');
    const postUserId = editPost.dataset.id;

    api.getUserById(postUserId).then(user => {
      refs.modalInputName.value = user.name;
      refs.modalInputAge.value = user.age;
    })

    refs.modal.dataset.id = postUserId;
    toggleModal();
  }

  function editUserSave() {
    const upUser = createUserInValueInput(refs.userUpdateInput);

    upUser.id = refs.modal.dataset.id;

    api.updateUser(upUser)
      .then(obj => obj.data)
      .then(user => repaintedPost(user))

    toggleModal();
  }

  function repaintedPost({ id, name, age }) {
    const post = refs.postWrapper.querySelector(`.post[data-id ="${id}"`);
    const postName = post.querySelector('p[data-name="name"]');
    const postAge = post.querySelector('p[data-name="age"]');

    postName.textContent = `NAME: ${name}`;
    postAge.textContent = `AGE: ${age}`;
  }

  function toggleModal() {
    refs.backdropModal.classList.toggle('is-visible');
  }

  function createUserInValueInput(nodaList) {
    const arrayInput = Array.from(nodaList);
    const arrayValue = arrayInput.map(input => input.value);

    return arrayValue.reduce((name, age) => {
      return new User(name, age);
    })
  }

  function deleteUserPost(target) {
    const post = target.closest('.post');
    const postIdToDelete = post.dataset.id;

    api.deleteUser(postIdToDelete).then(() => {
      post.remove();
    });
  }

  function createPostUser({ id, name, age }) {
    return `<div class="post" data-id='${id}'>
    <p class="post_id">ID: ${id}</p>
     <div> --------------------------------------  </div>
    <p class="post_data" data-name = 'name'>NAME: ${name}</p>
    <div> --------------------------------------  </div>
    <p class="post_data" data-name = 'age'>AGE: ${age}</p>
    <div> --------------------------------------  </div>
    <button class="btn" data-action = 'edit'>Редактировать</button>
    <button class="btn" data-action = 'delete'>Удалить</button>
    </div>`
  }

  function selectRefs() {
    const refs = {};

    refs.postWrapper = document.querySelector('.post-wrapper');
    refs.form = document.querySelector('.form');
    refs.allUserBtn = document.querySelector('button[data-action="show-all"]');
    refs.userInput = document.querySelectorAll('.js-user-input');
    refs.backdropModal = document.querySelector('.backdrop');
    refs.modal = document.querySelector('.modal');
    refs.userUpdateInput = document.querySelectorAll('.js-update-input');
    refs.modalInputName = document.querySelector('input[data-input="name"]');
    refs.modalInputAge = document.querySelector('input[data-input="age"]');

    return refs;
  }

});
