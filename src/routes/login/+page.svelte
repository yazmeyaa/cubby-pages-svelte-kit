<script labg="ts">
  import { applyAction, enhance } from '$app/forms'
  import FullPage from '$lib/components/base/FullPage.svelte'
  import ApiClient from '$lib/utils/ApiClient'
  import Field from '$lib/components/base/Field.svelte'
  import { addErrorToast, removeAllToasts } from '$lib/stores/toasts'
  import CommonHelper from '$lib/utils/CommonHelper'

  import { Button, Link, TextInput } from 'carbon-components-svelte'
  import ArrowRight from 'carbon-icons-svelte/lib/ArrowRight.svelte'

  import { _ } from 'svelte-i18n'
  import { goto } from '$app/navigation'

  let email = '';
  let password = '';
  let isLoading = false;
</script>

<FullPage fullSize>
  <form
    method="POST"
    class="form_container"
    use:enhance={() => {
      return async ({ result }) => {
        ApiClient.authStore.loadFromCookie(document.cookie)
        await applyAction(result)
      }
    }}
  >
    <div class="content txt-center m-b-base">
      <h1>Login to admin</h1>
    </div>

    <Field name="identity" let:uniqueId>
      <TextInput
        labelText="Email"
        type="email"
        name="email"
        id={uniqueId}
        bind:value={email}
        required
        autofocus
      />
    </Field>

    <Field name="password required" let:uniqueId>
      <TextInput
        labelText="Password"
        type="password"
        name="password"
        id={uniqueId}
        bind:value={password}
        required
      />
      <div class="help-block">
        <Link
          href="/request-password-reset"
          on:click={(event) => {
            event.preventDefault()
            goto('/recovery')
          }}
        >
          "Forgot password"
        </Link>
      </div>
    </Field>

    <Button
      disabled={isLoading}
      type="submit"
      icon={ArrowRight}
      style="width: fit-content; align-self: center;"
    >
      "Login"
    </Button>
  </form>
</FullPage>

<style>
  .form_container {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
</style>
