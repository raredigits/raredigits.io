document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navGlobal = document.querySelector('.nav-global');

  // Переключение меню
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navGlobal.classList.toggle('active');
  });

  // Закрытие по клику вне меню
  document.addEventListener('click', (event) => {
    if (!navGlobal.contains(event.target) && !hamburger.contains(event.target)) {
      hamburger.classList.remove('active');
      navGlobal.classList.remove('active');
    }
  });
});