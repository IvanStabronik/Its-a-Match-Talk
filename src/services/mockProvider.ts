import type { AppLocale, GenerationRequest, GoalId, Reply, ReplyVariant } from '@/types/domain';

type MockReplyTemplate = { text: string; why: string };
type MockReplySet = Record<ReplyVariant, MockReplyTemplate>;

const VARIANTS: ReplyVariant[] = ['Safe', 'Playful', 'Bold'];

/** Fallback when goal has no dedicated pool yet. */
const GENERIC_GOAL: GoalId = 'keep-it-going';

function pickSetIndex(poolSize: number, request: GenerationRequest): number {
  if (poolSize <= 1) return 0;
  const seed = request.messages.map((m) => m.text).join('|') + request.goal + request.tone;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  // Mix in time so Regenerate gives a different set with the same chat.
  hash = (hash + (Date.now() % 997)) >>> 0;
  return hash % poolSize;
}

export function getMockReplies(request: GenerationRequest): Reply[] {
  const locale = request.locale;
  const goal = resolveGoalPool(request.goal);
  const pool =
    MOCK_POOLS[locale]?.[goal] ??
    MOCK_POOLS.en[goal] ??
    MOCK_POOLS.en[GENERIC_GOAL]!;
  const setIndex = pickSetIndex(pool.length, request);
  const set = pool[setIndex] ?? pool[0]!;

  return VARIANTS.map((variant) => ({
    variant,
    text: set[variant].text,
    whyThisWorks: set[variant].why,
  }));
}

function resolveGoalPool(goal: GoalId): GoalId {
  if (goal in MOCK_POOLS.en) return goal;
  return GENERIC_GOAL;
}

// --- Reply pools: 2–3 sets per goal, per locale ---

const MOCK_POOLS: Record<AppLocale, Partial<Record<GoalId, MockReplySet[]>>> = {
  ru: {
    'keep-it-going': [
      {
        Safe: {
          text: 'Звучит интересно — а что тебе там больше всего запомнилось?',
          why: 'Открытый вопрос без давления, показывает искренний интерес.',
        },
        Playful: {
          text: 'Окей, ты уже второй раз меня так заинтриговала. Это специально или так всегда? 😄',
          why: 'Лёгкий флирт и юмор без пафоса.',
        },
        Bold: {
          text: 'Мне нравится, как ты рассказываешь. Давай продолжим — расскажи, чем ты сейчас увлечена?',
          why: 'Комплимент + конкретный вопрос, двигает разговор вперёд.',
        },
      },
      {
        Safe: {
          text: 'Понял тебя. А если копнуть глубже — что для тебя в этом главное?',
          why: 'Показывает, что ты слушаешь, и углубляет тему.',
        },
        Playful: {
          text: 'Слушай, с тобой даже про обыденное интересно говорить. Что дальше по плану?',
          why: 'Тёплый тон и лёгкий переход к следующей теме.',
        },
        Bold: {
          text: 'Честно, после твоего сообщения хочется узнать тебя лучше. Расскажи что-нибудь, чего я о тебе ещё не знаю.',
          why: 'Прямой интерес без навязчивости.',
        },
      },
      {
        Safe: {
          text: 'Классно. А как ты обычно проводишь время, когда есть свободный вечер?',
          why: 'Естественный переход к личным темам.',
        },
        Playful: {
          text: 'Ты сейчас серьёзно так написала или это твой обычный уровень интриги?',
          why: 'Игра с тоном, без кринжа и шаблонов.',
        },
        Bold: {
          text: 'Мне нравится твой темп в переписке. Давай не терять его — что тебе интересно обсудить дальше?',
          why: 'Уверенно, но уважительно.',
        },
      },
    ],
    'flirt-lightly': [
      {
        Safe: {
          text: 'У тебя приятный стиль общения — с тобой легко.',
          why: 'Мягкий комплимент без перегиба.',
        },
        Playful: {
          text: 'Опасно: ты пишешь так, что хочется отвечать быстрее обычного 😏',
          why: 'Лёгкий флирт с самоиронией.',
        },
        Bold: {
          text: 'Скажу честно — ты из тех, с кем хочется продолжить разговор не из вежливости.',
          why: 'Прямой, но не needy.',
        },
      },
      {
        Safe: {
          text: 'Не знаю, это ты такая или мне сегодня повезло с собеседником.',
          why: 'Комплимент через лёгкую недосказанность.',
        },
        Playful: {
          text: 'Предупреждаю: если так пойдёт и дальше, я начну думать, что ты специально меня балуешь.',
          why: 'Игриво, с юмором.',
        },
        Bold: {
          text: 'Ты явно умеешь держать внимание. Это опасное качество — в хорошем смысле.',
          why: 'Смелый комплимент без шаблонов пикапа.',
        },
      },
    ],
    'ask-for-date': [
      {
        Safe: {
          text: 'Слушай, мне приятно с тобой переписываться. Может, встретимся на кофе на этой неделе?',
          why: 'Конкретное приглашение в мягкой форме.',
        },
        Playful: {
          text: 'Предлагаю проверить, вживую мы так же хорошо общаемся. Кофе в субботу — как тебе?',
          why: 'Юмор + конкретная дата.',
        },
        Bold: {
          text: 'Хватит прятаться за экраном — давай увидимся. Когда тебе удобно?',
          why: 'Прямо, но не агрессивно.',
        },
      },
      {
        Safe: {
          text: 'Кажется, нам есть о чём поговорить не только здесь. Как насчёт прогулки в выходные?',
          why: 'Приглашение через общий интерес.',
        },
        Playful: {
          text: 'У меня теория: в реальности ты ещё интереснее. Готов проверить — пятница или суббота?',
          why: 'Игриво, с конкретикой.',
        },
        Bold: {
          text: 'Мне нравится наш вайб. Давай встретимся — выбери день, я подстроюсь.',
          why: 'Уверенность + гибкость.',
        },
      },
    ],
    'get-contact': [
      {
        Safe: {
          text: 'Здесь иногда неудобно — если хочешь, можем продолжить в Telegram. Как тебе?',
          why: 'Естественный переход без давления.',
        },
        Playful: {
          text: 'Боюсь, тут мы слишком хороши для этого приложения. Дашь телегу — продолжим там?',
          why: 'Лёгкий юмор, мягкий запрос контакта.',
        },
        Bold: {
          text: 'Давай не будем терять темп — скинь инсту или телегу, продолжим нормально.',
          why: 'Прямо, но уважительно.',
        },
      },
    ],
    'recover-awkward': [
      {
        Safe: {
          text: 'Ладно, кажется, я немного не туда свернул 😅 Давай с чистого листа — ты о чём?',
          why: 'Признаёт неловкость и возвращает разговор.',
        },
        Playful: {
          text: 'Окей, это был пробный заход. Версия 2.0 — без кринжа, обещаю.',
          why: 'Самоирония снимает напряжение.',
        },
        Bold: {
          text: 'Честно, я иногда пишу лишнее. Но мне правда интересно с тобой — давай попробуем ещё раз.',
          why: 'Прямота + искренность.',
        },
      },
      {
        Safe: {
          text: 'Похоже, я неудачно сформулировал. Перефразирую: мне интересно продолжить разговор.',
          why: 'Спокойно исправляет без оправданий.',
        },
        Playful: {
          text: 'Стоп, давай отменим последние 30 секунд переписки и начнём заново 😄',
          why: 'Юмор разряжает ситуацию.',
        },
        Bold: {
          text: 'Без фильтров: я иногда тороплюсь. Но ты мне правда интересна — давай без странностей.',
          why: 'Честность без needy-тона.',
        },
      },
    ],
    'clarify-intent': [
      {
        Safe: {
          text: 'Хочу понять тебя правильно — ты имеешь в виду, что просто дружески или что-то больше?',
          why: 'Прямой вопрос без давления.',
        },
        Playful: {
          text: 'Тут два варианта: ты флиртуешь или я уже слишком много думаю? 😄',
          why: 'Лёгко проясняет намерения.',
        },
        Bold: {
          text: 'Скажу прямо: мне интересно, куда это идёт. Ты как видишь?',
          why: 'Уверенно и по делу.',
        },
      },
    ],
    'reply-politely': [
      {
        Safe: {
          text: 'Спасибо, что написала — мне приятно, но сейчас не готов продолжать в этом ключе.',
          why: 'Вежливый отказ без жестокости.',
        },
        Playful: {
          text: 'Ты классная, правда. Но, кажется, мы на разных волнах — без обид?',
          why: 'Мягко, с теплом.',
        },
        Bold: {
          text: 'Ценю откровенность, но думаю, нам лучше не продолжать. Удачи тебе.',
          why: 'Чётко и уважительно.',
        },
      },
    ],
    'end-respectfully': [
      {
        Safe: {
          text: 'Было приятно пообщаться. Думаю, на этом лучше остановиться — удачи!',
          why: 'Мягкое завершение без ghosting.',
        },
        Playful: {
          text: 'Ты крутая, но, кажется, нам не по пути. Без drama — просто на этом закончим 😊',
          why: 'Тепло и без неловкости.',
        },
        Bold: {
          text: 'Скажу честно: мне не подходит продолжать. Спасибо за разговор и всего хорошего.',
          why: 'Прямо, но без грубости.',
        },
      },
    ],
  },

  uk: {
    'keep-it-going': [
      {
        Safe: { text: 'Звучить цікаво — а що тобі там найбільше запам\'яталось?', why: 'Відкрите питання без тиску.' },
        Playful: { text: 'Окей, ти вже другий раз мене так заінтриговала. Це спеціально? 😄', why: 'Легкий флірт.' },
        Bold: { text: 'Мені подобається, як ти розповідаєш. Розкажеш, чим зараз захоплена?', why: 'Комплімент + питання.' },
      },
      {
        Safe: { text: 'Зрозумів. А якщо глибше — що для тебе в цьому головне?', why: 'Показує, що слухаєш.' },
        Playful: { text: 'З тобою навіть про буденне цікаво. Що далі за планом?', why: 'Теплий перехід.' },
        Bold: { text: 'Чесно, після твого повідомлення хочеться дізнатися тебе краще.', why: 'Прямий інтерес.' },
      },
    ],
    'flirt-lightly': [
      {
        Safe: { text: 'У тебе приємний стиль спілкування — з тобою легко.', why: 'М\'який комплімент.' },
        Playful: { text: 'Небезпечно: ти пишеш так, що хочеться відповідати швидше 😏', why: 'Легкий флірт.' },
        Bold: { text: 'Скажу чесно — з тобою хочеться продовжити не з ввічливості.', why: 'Прямо, без neediness.' },
      },
    ],
    'ask-for-date': [
      {
        Safe: { text: 'Мені приємно з тобою переписуватись. Може, зустрінемось на каву цього тижня?', why: 'Конкретне запрошення.' },
        Playful: { text: 'Пропоную перевірити, чи вживу ми так само добре спілкуємось. Кава в суботу?', why: 'Гумор + дата.' },
        Bold: { text: 'Давай побачимось — коли тобі зручно?', why: 'Прямо і поважно.' },
      },
    ],
    'recover-awkward': [
      {
        Safe: { text: 'Здається, я трохи не туди пішов 😅 Давай з чистого аркуша.', why: 'Визнає неловкість.' },
        Playful: { text: 'Окей, це була пробна версія. Версія 2.0 — без кринжу.', why: 'Самоіронія.' },
        Bold: { text: 'Іноді пишу зайве. Але ти мені справді цікава — спробуємо ще раз?', why: 'Щирість.' },
      },
    ],
    'get-contact': [
      {
        Safe: { text: 'Тут іноді незручно — можемо продовжити в Telegram, якщо хочеш.', why: 'Природний перехід.' },
        Playful: { text: 'Ми занадто хороші для цього додатку. Даси телегу?', why: 'Гумор + запит.' },
        Bold: { text: 'Скинь інсту або телегу — продовжимо нормально.', why: 'Прямо.' },
      },
    ],
    'clarify-intent': [
      {
        Safe: { text: 'Хочу зрозуміти правильно — ти дружньо чи щось більше?', why: 'Без тиску.' },
        Playful: { text: 'Ти фліртуєш чи я вже забагато думаю? 😄', why: 'Легко.' },
        Bold: { text: 'Мені цікаво, куди це йде. Ти як бачиш?', why: 'Прямо.' },
      },
    ],
    'reply-politely': [
      {
        Safe: { text: 'Дякую, що написала — мені приємно, але зараз не готовий продовжувати.', why: 'Ввічлива відмова.' },
        Playful: { text: 'Ти класна, але ми на різних хвилях — без образ?', why: 'М\'яко.' },
        Bold: { text: 'Думаю, нам краще не продовжувати. Удачі!', why: 'Чітко.' },
      },
    ],
    'end-respectfully': [
      {
        Safe: { text: 'Було приємно поспілкуватись. На цьому краще зупинитись — удачі!', why: 'М\'яке завершення.' },
        Playful: { text: 'Ти крута, але нам не по дорозі. Без drama 😊', why: 'Тепло.' },
        Bold: { text: 'Мені не підходить продовжувати. Дякую за розмову.', why: 'Прямо.' },
      },
    ],
  },

  pl: {
    'keep-it-going': [
      {
        Safe: { text: 'Brzmi ciekawie — co ci się tam najbardziej zapadło w pamięć?', why: 'Otwarte pytanie bez presji.' },
        Playful: { text: 'Okej, znowu mnie intrygujesz. To specjalnie czy zawsze tak? 😄', why: 'Lekki flirt.' },
        Bold: { text: 'Podoba mi się, jak opowiadasz. Czym się teraz zajmujesz?', why: 'Komplement + pytanie.' },
      },
      {
        Safe: { text: 'Rozumiem. A głębiej — co jest dla ciebie najważniejsze?', why: 'Pokazuje, że słuchasz.' },
        Playful: { text: 'Z tobą nawet o zwykłych rzeczach ciekawie. Co dalej?', why: 'Ciepły ton.' },
        Bold: { text: 'Szczerze — chcę cię lepiej poznać po tej wiadomości.', why: 'Bezpośredni zainteresowanie.' },
      },
    ],
    'flirt-lightly': [
      {
        Safe: { text: 'Masz przyjemny styl rozmowy — łatwo się z tobą gada.', why: 'Delikatny komplement.' },
        Playful: { text: 'Niebezpiecznie — piszesz tak, że chce się odpowiadać szybciej 😏', why: 'Lekki flirt.' },
        Bold: { text: 'Szczerze — chcę kontynuować, nie z grzeczności.', why: 'Bez neediness.' },
      },
    ],
    'ask-for-date': [
      {
        Safe: { text: 'Miło mi się z tobą pisze. Może kawa w tym tygodniu?', why: 'Konkretne zaproszenie.' },
        Playful: { text: 'Sprawdźmy, czy na żywo też tak dobrze rozmawiamy. Sobota?', why: 'Humor + data.' },
        Bold: { text: 'Spotkajmy się — kiedy masz czas?', why: 'Bezpośrednio.' },
      },
    ],
    'recover-awkward': [
      {
        Safe: { text: 'Chyba trochę nie tam poszedłem 😅 Zacznijmy od nowa.', why: 'Przyznaje niezręczność.' },
        Playful: { text: 'To była wersja próbna. Wersja 2.0 — bez cringe.', why: 'Autoironía.' },
        Bold: { text: 'Czasem piszę za dużo. Ale jesteś ciekawa — spróbujemy jeszcze raz?', why: 'Szczerość.' },
      },
    ],
    'get-contact': [
      {
        Safe: { text: 'Tu bywa niewygodnie — możemy na Telegramie, jeśli chcesz.', why: 'Naturalne przejście.' },
        Playful: { text: 'Jesteśmy za dobrzy na tę apkę. Daj telegram?', why: 'Humor.' },
        Bold: { text: 'Daj insta albo telegram — kontynuujmy normalnie.', why: 'Bezpośrednio.' },
      },
    ],
    'clarify-intent': [
      {
        Safe: { text: 'Chcę dobrze zrozumieć — mówisz przyjacielsko czy coś więcej?', why: 'Bez presji.' },
        Playful: { text: 'Flirtujesz czy ja za dużo myślę? 😄', why: 'Lekko.' },
        Bold: { text: 'Ciekawi mnie, dokąd to zmierza. Jak ty to widzisz?', why: 'Jasno.' },
      },
    ],
    'reply-politely': [
      {
        Safe: { text: 'Dzięki za wiadomość — miło, ale nie chcę kontynuować w tym kierunku.', why: 'Grzeczna odmowa.' },
        Playful: { text: 'Super jesteś, ale chyba na różnych falach — bez urazy?', why: 'Miękko.' },
        Bold: { text: 'Lepiej nie kontynuować. Powodzenia!', why: 'Jasno.' },
      },
    ],
    'end-respectfully': [
      {
        Safe: { text: 'Miło się pogadało. Lepiej tu skończyć — powodzenia!', why: 'Miłe zakończenie.' },
        Playful: { text: 'Super jesteś, ale nie po drodze. Bez dramy 😊', why: 'Ciepło.' },
        Bold: { text: 'Nie chcę kontynuować. Dzięki za rozmowę.', why: 'Bezpośrednio.' },
      },
    ],
  },

  en: {
    'keep-it-going': [
      {
        Safe: { text: 'That sounds interesting — what stood out to you the most?', why: 'Open question without pressure.' },
        Playful: { text: 'Okay, you\'ve intrigued me twice now. Is this on purpose? 😄', why: 'Light flirt, no cringe.' },
        Bold: { text: 'I like how you tell stories. What are you into these days?', why: 'Compliment + forward motion.' },
      },
      {
        Safe: { text: 'Got it. If we go deeper — what matters most to you about this?', why: 'Shows you\'re listening.' },
        Playful: { text: 'Even small talk is fun with you. What\'s next on your agenda?', why: 'Warm transition.' },
        Bold: { text: 'Honestly, after that message I want to know you better.', why: 'Direct interest.' },
      },
      {
        Safe: { text: 'Nice. What do you usually do on a free evening?', why: 'Natural pivot to personal topics.' },
        Playful: { text: 'Are you always this intriguing or is today special?', why: 'Playful tone.' },
        Bold: { text: 'I like your pace in chat. Let\'s keep it — what should we talk about next?', why: 'Confident and respectful.' },
      },
    ],
    'flirt-lightly': [
      {
        Safe: { text: 'You have an easy way of talking — I like that.', why: 'Soft compliment.' },
        Playful: { text: 'Dangerous: you type in a way that makes me reply faster 😏', why: 'Light flirt.' },
        Bold: { text: 'I\'ll be honest — I want to keep talking, not just be polite.', why: 'Direct, not needy.' },
      },
      {
        Safe: { text: 'Not sure if you\'re always like this or I just got lucky today.', why: 'Compliment through understatement.' },
        Playful: { text: 'Fair warning: if this continues, I\'ll think you\'re spoiling me on purpose.', why: 'Playful.' },
        Bold: { text: 'You clearly know how to hold attention. Dangerous quality — in a good way.', why: 'Bold compliment.' },
      },
    ],
    'ask-for-date': [
      {
        Safe: { text: 'I enjoy chatting with you. Coffee this week?', why: 'Concrete invite, soft tone.' },
        Playful: { text: 'Let\'s test if we\'re this good in person. Saturday coffee?', why: 'Humor + date.' },
        Bold: { text: 'Let\'s meet — when works for you?', why: 'Direct and respectful.' },
      },
      {
        Safe: { text: 'Feels like we have more to talk about offline. Walk this weekend?', why: 'Invite through shared vibe.' },
        Playful: { text: 'Theory: you\'re even better in real life. Friday or Saturday?', why: 'Playful + specific.' },
        Bold: { text: 'I like our vibe. Pick a day — I\'ll make it work.', why: 'Confident + flexible.' },
      },
    ],
    'get-contact': [
      {
        Safe: { text: 'This app can be awkward — happy to continue on Telegram if you want.', why: 'Natural transition.' },
        Playful: { text: 'We\'re too good for this app. Telegram?', why: 'Humor + ask.' },
        Bold: { text: 'Let\'s not lose momentum — drop your IG or Telegram.', why: 'Direct.' },
      },
    ],
    'recover-awkward': [
      {
        Safe: { text: 'I think I took a wrong turn there 😅 Fresh start — what were you saying?', why: 'Acknowledges awkwardness.' },
        Playful: { text: 'That was the beta version. v2.0 — cringe-free, promise.', why: 'Self-deprecating humor.' },
        Bold: { text: 'I sometimes overtext. But I\'m genuinely interested — try again?', why: 'Honest.' },
      },
      {
        Safe: { text: 'Bad phrasing on my part. Rephrasing: I\'d like to keep talking.', why: 'Calm fix.' },
        Playful: { text: 'Can we undo the last 30 seconds and restart? 😄', why: 'Humor defuses tension.' },
        Bold: { text: 'No filter: I rush sometimes. But you\'re interesting — let\'s skip the weird bit.', why: 'Direct honesty.' },
      },
    ],
    'clarify-intent': [
      {
        Safe: { text: 'Want to read you right — friendly vibe or something more?', why: 'Clear without pressure.' },
        Playful: { text: 'Are you flirting or am I overthinking? 😄', why: 'Light clarification.' },
        Bold: { text: 'I\'ll be direct: I\'m curious where this is going. How do you see it?', why: 'Confident.' },
      },
    ],
    'reply-politely': [
      {
        Safe: { text: 'Thanks for reaching out — I appreciate it, but I\'m not looking to continue that way.', why: 'Polite decline.' },
        Playful: { text: 'You seem great, but I think we\'re on different wavelengths — no hard feelings?', why: 'Warm.' },
        Bold: { text: 'I don\'t think we should continue. Wishing you the best.', why: 'Clear and kind.' },
      },
    ],
    'end-respectfully': [
      {
        Safe: { text: 'Nice chatting. I think we should stop here — take care!', why: 'Soft closure.' },
        Playful: { text: 'You\'re cool, but not our path. No drama 😊', why: 'Warm exit.' },
        Bold: { text: 'I\'m not up for continuing. Thanks for the conversation.', why: 'Direct.' },
      },
    ],
  },
};
