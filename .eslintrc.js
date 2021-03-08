module.exports = {
  "extends": [
    "airbnb",
    "prettier",
    "prettier/react"
  ],
  "parser": "babel-eslint",
  "ecmaFeatures": {
    "classes": true
  },
  "rules": {
    "react/jsx-filename-extention": ["error", { "extentions": [".js", "jsx"]}],
    "linebreak-style": ["error", "windows"]
  }
};
