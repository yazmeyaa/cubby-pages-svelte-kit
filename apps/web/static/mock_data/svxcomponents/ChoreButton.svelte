<script lang="ts">
    import { Button, Modal } from "carbon-components-svelte";
    import { writable } from "svelte/store";
    import { tick } from "svelte";
    import { connect, JSONCodec, type Codec, type NatsConnection} from "nats.ws";

    export let chore: string = "";
    export let options: any = {};
    export let show_success_alert: boolean = true;
    export let kind: "primary" | "secondary" | "tertiary" | "ghost" | "danger" | "danger-tertiary" | "danger-ghost" | undefined = undefined;
    
    let open = writable(false);
    let message = writable("");
    let title = writable("");
    let is_loading = writable(false);
    export const disabled: boolean = false;

    let nc: NatsConnection | null = null;
    let sc: any = JSONCodec();
    let hasFatalError : Writable<{
        code: number,
        message: string,
    }> = writable(false);

    async function CallCube() {
   
        if (!nc) {
            try {
                nc = await connect({ servers: [  `ws://${document.location.hostname}:8866` ] })
            } catch(e) {
                hasFatalError.set({
                    code: 500,
                    message: "Не удалось подключиться к серверу шины данных"
                })
                return Promise.reject("wrong conn")
            }
        }

        let result = await nc?.request("cubby.back.query.workspace.datasource.call", sc.encode({
            input: {
                chore: chore,
                options: JSON.stringify(options),
            },
        }), { timeout: 20000 }).then(e => {
            console.log(e);
            is_loading.set(false);
        }).catch(e => {
            console.warn(e);
            is_loading.set(false);
        })
    }

</script>

<Button disabled={$is_loading && !disabled} kind={kind} on:click={async () => {
    if (chore.length === 0) {
        message.set(`Не указана функция для вызова — или указана неверно. Текущее значение \"${chore}\", параметры \"${JSON.stringify(options)}\"`)
        title.set("Тут что-то не здесь...")
        await tick();
        open.set(true);
        return;
    };
    is_loading.set(true);
        console.log(JSON.stringify(options) + chore);
    await CallCube();

    // await tick();
    setTimeout(() => {
        if (show_success_alert) {
            message.set(`Функция \"${chore}\" успешно поставлена на обработку в очередь сервером TM1`);
            title.set("Это успех!")
        }
    }, 1200)

}}><slot></slot></Button>

{#if $open}
<Modal passiveModal open={true} modalHeading={$title} on:open on:close>
  <p>
    {$message}
  </p>
</Modal>
{/if}