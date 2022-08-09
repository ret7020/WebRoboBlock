const translations = {
    // English translations
    "en": {
      "aval_blocks_heading": "Available blocks",
      "actions_chain": "Actions chain",
      "download_json": "Download json file",
      "camera_shot_title": "Camera Video (Disabled while dev)",
      "manual_controller": "Manual controller",
      "manual_enabled": "Enabled",
      "settings": "settings",
      "language": "Language",
      "theme_switcher": "Theme",
      "dark_theme_switch": "Dark",
      "light_theme_switch": "Light"
    },
    // Russian
    "ru": {
      "aval_blocks_heading": "Доступные блоки",
      "actions_chain": "Программа",
      "download_json": "Скачать JSON файл",
      "camera_shot_title": "Видео с камеры",
      "manual_controller": "Ручное управление",
      "manual_enabled": "Включено",
      "settings": "настройки",
      "language": "Язык",
      "theme_switcher": "Тема",
      "dark_theme_switch": "Тёмная",
      "light_theme_switch": "Светлая"
    },
};

const block_translations = {
    "repeat": {
        "en": ["FOR loop"],
        "ru": ["Цикл FOR"]
    }, 
    "forward": {
        "en": ["Forward", "Speed", "Sensor id", "Sensor val"],
        "ru": ["Вперёд", "Скорость", "Датчик", "Значение датчика"]
    },
    "left": {
        "en": ["Rotate left", "Speed", "Sensor id", "Sensor val"],
        "ru": ["Поворот налево", "Скорость", "Датчик", "Значение датчика"]
    },
    "right": {
        "en": ["Rotate right", "Speed", "Sensor id", "Sensor val"],
        "ru": ["Поворот направо", "Скорость", "Датчик", "Значение датчика"]
    },
    "servo": {
        "en": ["Servo number", "Start angle", "Finish angle", "Delay"],
        "ru": ["Номер сервы", "Начальный угол", "Конечный угол", "Интервал"]
    }
}


document.addEventListener("DOMContentLoaded", () => {
    // Translate UI items
    document.querySelectorAll("[data-i18n-key]").forEach(function(el){translateElement(el, "en")}); // en - default lang
    // Translate blocks content
    document.querySelectorAll("[data-i18n-block]").forEach(function(el){translateBlocks(el, "en")}); // en - default lang
});

function translateElement(element, lang_code="en") {
    const key = element.getAttribute("data-i18n-key");
    const translation = translations[lang_code][key];
    element.innerText = translation;
}

function translateBlocks(element, lang_code="en"){
    try{
        const block_type = element.getAttribute("data-i18n-block");
        const params = $(element).children();
        let norm_ind = 0;
        $.each(params, function(index, param){
            if($(param)[0].className == "block-arg"){
                $(param).children()[0].innerText = block_translations[block_type][lang_code][norm_ind];
                norm_ind += 1;
            }
        });
    }catch{}
    
}

function switch_language(lang="en"){
    document.querySelectorAll("[data-i18n-key]").forEach(function(elem){
        translateElement(elem, lang);
    });
    document.querySelectorAll("[data-i18n-block]").forEach(function(elem){
        translateBlocks(elem, lang);
    });
}

