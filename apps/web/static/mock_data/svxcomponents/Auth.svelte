<script lang="ts">
    import { onMount, SvelteComponent } from 'svelte';
    import { browser } from '$app/environment';
    import {
        Button, TextInput, Form,
        FormGroup, Checkbox,
        RadioButtonGroup,
        RadioButton,
        ToastNotification,
        Loading,
        ModalHeader,
        ModalBody,
        ModalFooter,
		Column, Grid, Row,
        PasswordInput,
    } from "carbon-components-svelte";
    import Login from "carbon-icons-svelte/lib/Login.svelte";
	import { goto } from '$app/navigation';
    

    let CModal: any;
    let host: string;
    let password: string;
    let username: string = "admin";
    let checked: boolean;

    onMount(async () => {
        const { ComposedModal } = await import('carbon-components-svelte');
        CModal = ComposedModal;
        host = window.location.host;
    });

    export let open = false;

    let submittedValue:any = null;

</script>

<br />
<Button  icon={Login} on:click={() => (open = true)}>Войти</Button>
<svelte:window />

{#if browser}
    <svelte:component this={CModal}
        bind:open
        size="sm"
        preventCloseOnClickOutside
        modalHeading="Авторизация в сервисе"
        primaryButtonText="Войти"
        primaryButtonType="submit"
        secondaryButtonText="Отменить"
        on:click:button--secondary={() => (open = false)}
        on:open
        on:close
        on:submit={() => {
            submittedValue = {
                creds: {
                    password,
                    username,
                },
                host,
                protocol: "non-tls-version-04"
            }

            localStorage.setItem("cubberAuth", JSON.stringify(submittedValue));
            setTimeout(() => {
                // submittedValue = null;
                setTimeout(() => {
                    document.location.reload();
                }, 1000);
                 goto('/', {
                    replaceState: true
                })
            }, 2000)
        }}
        
    >
        <ModalHeader label="Войти" title="Вам необходимы логин и пароль для доступа к сервису" />
        <ModalBody hasForm>
            {#if submittedValue !== null }<Loading />{/if}
    
            <Row style="margin-bottom:0px;">
                    <Column>
                        <TextInput
                 
                            labelText="Адрес хоста"
                            bind:value={host}
                        />
                    </Column>
                    <Column>
                        <FormGroup legendText="Протокол">
                            <RadioButtonGroup name="protocol" selected="non-tls-version-04">
                            <RadioButton
                                style="margin-top:5px"
                                value="secure-version-04"
                                labelText="tls-04"
                                disabled
                            />
                            <RadioButton
                                style="margin-top:5px"
                                value="non-tls-version-04"
                                labelText="non-tls-04"
                            />
                            </RadioButtonGroup>
                        </FormGroup>
                    </Column>
                </Row>
                
                <Row style="margin-bottom:0px;">
                    <Column>
                        <TextInput
                            readonly
                            placeholder="Имя пользователя"
                            labelText="Пользователь"
                            bind:value={username}
                        />
                    </Column>
                    <Column>
                        <PasswordInput
                            labelText="Пароль"
                            placeholder="Ваш пароль"
                            type="password"
                            bind:value={password}
                        />
                    </Column>
                </Row>
                <Row style="margin-top:10px;">
                    <Column>
                         <Checkbox labelText="Правила доступа к сервису" bind:checked />
                    </Column>
                </Row>
      
        </ModalBody>
        <ModalFooter primaryButtonText="Войти" primaryButtonDisabled={!checked} />
   
    </svelte:component>

{/if}