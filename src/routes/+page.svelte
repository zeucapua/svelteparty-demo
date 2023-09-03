<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import PartySocket from "partysocket";

  // checks if we are in dev mode
  import { dev } from "$app/environment";

  let name : string;
  let party_messages : string[] = [];
  
  let room_id : string | undefined = $page.url.searchParams.get("room_id") ?? undefined;

  // undefined if there is no 'room_id' to connect to (might error?)
  let socket : PartySocket | undefined;

  onMount(() => {
    if (room_id) {
      socket = new PartySocket({
        // 'localhost:1999' is the host URL to connect to when running 'npx partykit dev' 
        // '<party-name>.<username>.partykit.dev/party/:id' will be live to connect to after running 'npx partykit deploy'
        host: dev ? "localhost:1999" : `https://svelteparty-demo.zeucapua.partykit.dev/party/${room_id}`,
        room: room_id // join specific room
      });


      // listen to party's broadcasts (this.party.broadcast) from server
      socket.addEventListener("message", (event) => {
        party_messages = [...party_messages, event.data];
      });
    }
  });

  function sendToPartyServer(message : string) {
    if (socket) {
      // server can listen to this via 'onMessage'
      socket.send(message);
    }
  }
</script>

<h1 class="text-5xl font-bold">PartyKit + SvelteKit Demo</h1>
<p>
  ROOM: 
  {#if room_id}
   {room_id} ({socket?.id})
  {:else}
    Not in One
  {/if}
</p>

<input type="text" placeholder="Enter name" bind:value={name} />
<button on:click={() => sendToPartyServer(`[${room_id}] ${name}: Hello!`)}>
  Say Hello
</button>

<h3>Party Messages</h3>
{#each party_messages as msg}
  <p>{msg}</p>
{/each}
