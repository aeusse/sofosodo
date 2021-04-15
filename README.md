# sofosodo
Software for software documentation

Sofosodo es el nombre en clave mientras se busca uno

# Clonar

- `git clone https://github.com/aeusse/sofosodo.git`
- `cd sofosodo/`
- `firebase login` (para entrar o para ver con cuál cuenta estamos)
- `firebase init`
    - Firestore, Functions, Hosting y Storage
    - Typescript
    - Todo lo demás es darle enter
- `firebase use default`
- _Revisamos los cambios que genera el firebase init (git diff), para ver si hay que actualizar paquetes o alguna configuración, o para ver si devolvemos algún cambio. **Por lo general podemos optar por devolver TODOS los cambios**_
- _Ubicamos las credenciales_
- `cd sofosodo/functions`
- `npm i`
- `npm run serve`
