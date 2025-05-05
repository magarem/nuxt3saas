<template>
    <div>
      <h2>Cliente WebSocket</h2>
      <p v-if="message">Mensagem do servidor: {{ message }}</p>
      <p v-if="receivedMessage">Mensagem recebida de outro cliente: {{ receivedMessage }}</p>
      <input type="text" v-model="newMessage" placeholder="Digite sua mensagem">
      <button @click="sendMessage" :disabled="!websocket">Enviar</button>
      <p v-if="!websocket">Conectando ao WebSocket...</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const websocket = ref(null);
  const message = ref('');
  const receivedMessage = ref('');
  const newMessage = ref('');
  
  onMounted(() => {
    connectWebSocket();
  });
  
  onUnmounted(() => {
    if (websocket.value) {
      websocket.value.close();
    }
  });
  
  function connectWebSocket() {
    websocket.value = new WebSocket('wss://suryanet.site/ws:3002'); // Use o endereço do seu servidor WebSocket
  
    websocket.value.onopen = () => {
      console.log('Conectado ao WebSocket');
    };
  
    websocket.value.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.message && data.message.includes('Bem-vindo')) {
          message.value = data.message;
        } else if (data.message) {
          receivedMessage.value = data.message;
        }
      } catch (error) {
        console.error('Erro ao processar mensagem:', error);
      }
    };
  
    websocket.value.onclose = () => {
      console.log('Desconectado do WebSocket');
      // Tente reconectar após um certo tempo
      setTimeout(connectWebSocket, 2000);
    };
  
    websocket.value.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };
  }
  
  function sendMessage() {
    if (websocket.value && websocket.value.readyState === WebSocket.OPEN) {
      websocket.value.send(newMessage.value);
      newMessage.value = '';
    }
  }
  </script>