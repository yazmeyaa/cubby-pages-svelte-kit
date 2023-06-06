<script>
    import "@carbon/styles/css/styles.css";
    import Document from "$lib/layouts/Document.svelte";
    import { Loading } from "carbon-components-svelte";
    import "@carbon/charts/styles.css";
    
    export let title;
    

    async function GetMenu() {
        let res = await fetch('/menu-spec.json');
        // console.log(res);
        // const j = 
        // console.log(j)
        return res.json();
    }

    // let MENU = [
    //         {id: "/", text: "Демо-разметка"},
    //         {id: "/Пример-запросов/", text: "Пример",
    //             expanded: true,
    //             children: [
    //                 {id: "/Пример-запросов/Валюты", text: "Валюты"}
    //         ]},
    //         {id: "/Служебные-формы/", text: "Служебные формы",
    //             expanded: true,
    //             children: [
    //                 {id: "/Служебные-формы/База-распределения-ОХР/", text: "База распределения ОХР"},
    //                 {id: "/Служебные-формы/Допущения-бюджетной-модели/", text: "Допущения бюджетной модели"},
    //                 {id: "/Служебные-формы/Курсы-валют/", text: "Курсы валют"},
    //                 {id: "/Служебные-формы/Соответствие-статей-и-элементов-затрат/", text: "Соответствие статей и элементов затрат"},
    //             ]},
    //         {id: "/Доходы-и-поступления/", text: "Доходы и поступления",
    //             expanded: true,
    //             children: [
    //                 {id: "/Доходы-и-поступления/Авансы-и-ДЗ-покупателей/", text: "База распределения ОХР"},
    //                 {id: "/Доходы-и-поступления/Бюджет-продаж/", text: "Бюджет продаж"},
    //                 {id: "/Доходы-и-поступления/Поступления-от-продаж/", text: "Поступления от продаж"},
    //             ]},
    //         {id: "/Закупки/", text: "Закупки",
    //             expanded: true,
    //             children: [
    //                 {id: "/Закупки/Выплаты-по-многоцелевым-и-косвенным-СиМ/", text: "Выплаты по многоцелевым и косвенным СиМ"},
    //                 {id: "/Закупки/Закупки-по-операционной-деятельности/", text: "Закупки по операционной деятельности"},
    //             ]},
    //     ];
</script>

{#await GetMenu()}
   <Loading withOverlay={false} />
{:then menu } 

<Document menu={menu.menu}>
    <slot>
       
    </slot>
</Document>
{/await}
