const locale = "ru"; // Default language

const translations = {
    // English translations
    "en": {
      "aval_blocks_heading": "Available blocks",
      "actions_chain": "Actions chain",
      "download_json": "Download json file",
      "camera_shot_title": "Camera Video (Disabled while dev)",
      "manual_controller": "Manual controller",
      "manual_enabled": "Enabled"
    },
    // Russian
    "ru": {
      "aval_blocks_heading": "Доступные блоки",
      "actions_chain": "Программа",
      "download_json": "Скачать JSON файл",
      "camera_shot_title": "Видео с камеры",
      "manual_controller": "Ручное управление",
      "manual_enabled": "Включено"
    },
};


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-i18n-key]").forEach(translateElement);
});

function translateElement(element) {
    const key = element.getAttribute("data-i18n-key");
    const translation = translations[locale][key];
    element.innerText = translation;
  }



