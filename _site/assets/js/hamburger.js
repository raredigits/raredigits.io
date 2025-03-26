document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.Hamburger');
  const globalNav = document.querySelector('.GlobalNav');

  // Переключение меню
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    globalNav.classList.toggle('active');
  });

  // Закрытие по клику вне меню
  document.addEventListener('click', (event) => {
    if (!globalNav.contains(event.target) && !hamburger.contains(event.target)) {
      hamburger.classList.remove('active');
      globalNav.classList.remove('active');
    }
  });
});