// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import Aura from '@primevue/themes/aura';
export default defineNuxtConfig({
  
  nitro: {
    // handlers: [
    //   { route: '/api/:domain/**', handler: '~/server/middleware/check-domain-exists.js' },
    //   { route: '/:domain/**', handler: '~/server/middleware/check-domain-exists.js' },
    //   { route: '/:domain/', handler: '~/server/middleware/check-domain-exists.js' }
    // ],
    
    // routeRules: {
    //   '/*/auth/login': { // Qualquer segmento antes de /auth/login
    //     headers: {
    //       'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests; base-uri 'self'; form-action 'self' http://localhost:3000;"
    //     }
    //   },
    //   '/**': { // CSP padrão para o restante da aplicação
    //     headers: {
    //       'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; object-src 'none'; frame-ancestors 'self'; upgrade-insecure-requests; base-uri 'self'; form-action 'self';"
    //     }
    //   }
    // },

    publicAssets: [
      {
        dir: 'server/data',
        baseURL: '/data'
      }
    ]
  },
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css', '~/assets/tailwind.css', '~/assets/styles.scss'],
  devtools: { enabled: true },
  modules: ['@nuxt/scripts', '@primevue/nuxt-module', 'nuxt-security'],
  primevue: {
      options: {
          theme: {
              preset: Aura,
              options: {
                  darkModeSelector: '.app-dark'
              }
          },
        locale: {
        // Brazilian Portuguese locale settings
        apply: 'Aplicar',
        clear: 'Limpar',
        dayNames: ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"],
        dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        dayNamesMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
        monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        today: 'Hoje',
        firstDayOfWeek: 0, // Sunday as first day of week
        weekHeader: 'Sem',
        dateFormat: 'dd/mm/yy', // Brazilian date format
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
            pageLabel: '{pageIdx}'
        }
      }
      }
  },
  security: {
    // Options
  },
  vite: {
      plugins: [
        tailwindcss(),
      ],
      server: {
        watch: {
          ignored: ['**/*.db', '**/server/data/*.db'],
        },
      }
    }
})