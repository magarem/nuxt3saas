// plugins/primevue.client.js
import PrimeVue from 'primevue/config';
import DatePicker from 'primevue/datepicker'; // Import any PrimeVue components you'll use globally, like DatePicker

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true, // Optional: Enables ripple effect
    locale: {
      apply: 'Aplicar',
      clear: 'Limpar',
      // Calendar
      dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
      dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
      dayNamesMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
      monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
      monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
      today: 'Hoje',
      firstDayOfWeek: 0, // Sunday
      weekHeader: 'Sem',
      dateFormat: 'dd/mm/yy', // Brazilian format
      weak: 'Fraco',
      medium: 'Médio',
      strong: 'Forte',
      passwordPrompt: 'Digite uma senha',
      emptyFilterMessage: 'Nenhum resultado encontrado',
      emptyMessage: 'Nenhum item encontrado',
      aria: {
        trueLabel: 'Verdadeiro',
        falseLabel: 'Falso',
        nullLabel: 'Não selecionado',
        star: '1 estrela',
        stars: '{0} estrelas',
        selectAll: 'Selecionar todos',
        unselectAll: 'Desmarcar todos',
        close: 'Fechar',
        previous: 'Anterior',
        next: 'Próximo',
        navigation: 'Navegação',
        scrollTop: 'Rolar para o topo',
        selectLabel: 'Selecionar',
        unselectLabel: 'Deselecionar',
        expandLabel: 'Expandir',
        collapseLabel: 'Colapsar',
        scrollToTarget: 'Rolar para o destino',
        moveTop: 'Mover para o topo',
        moveUp: 'Mover para cima',
        moveDown: 'Mover para baixo',
        moveBottom: 'Mover para baixo',
        moveToTarget: 'Mover para o destino',
        dialog: 'Diálogo',
        alert: 'Alerta',
        datePicker: 'Seletor de Data',
        dateTimePicker: 'Seletor de Data e Hora',
        filter: 'Filtro',
        week: 'Semana',
        day: 'Dia',
        hour: 'Hora',
        minute: 'Minuto',
        second: 'Segundo',
        am: 'AM',
        pm: 'PM',
        today: 'Hoje',
        monthPicker: 'Seletor de mês',
        yearPicker: 'Seletor de ano',
        nextMonth: 'Próximo mês',
        previousMonth: 'Mês anterior',
        nextYear: 'Próximo ano',
        previousYear: 'Ano anterior',
        nextDecade: 'Próxima década',
        previousDecade: 'Década anterior',
        nextCentury: 'Próximo século',
        previousCentury: 'Século anterior',
        chooseDay: 'Escolher dia',
        chooseMonth: 'Escolher mês',
        chooseYear: 'Escolher ano',
        chooseDecade: 'Escolher década',
        chooseCentury: 'Escolher século',
        previousPage: 'Página anterior',
        nextPage: 'Próxima página',
        firstPage: 'Primeira página',
        lastPage: 'Última página',
        pageLabel: '{pageIdx}',
      }
    }
  });

  // Optional: Register components globally if you prefer
  // This avoids importing them in every component that uses them
  nuxtApp.vueApp.component('DatePicker', DatePicker);
});