/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // 🔥 Дадаем вялікі таймаўт для інтэграцыйных тэстаў
  testTimeout: 100000,

  // 🧪 Пошук тэставых файлаў (E2E або Unit)
  testRegex: "__tests__/.*\\.(test|spec|e2e)\\.ts$",

  // 🛠️ Каб Jest правільна кампіліраваў TypeScript
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },

  // ⚙️ Каб пазбегнуць "open handle" і "hanging test"
  detectOpenHandles: true, // Уключыць праверку адкрытых рэсурсаў
  forceExit: true, // Прымусова завяршаць Jest пасля выканання тэстаў

  // 📢 Больш падрабязны вывад
  verbose: true,
};
