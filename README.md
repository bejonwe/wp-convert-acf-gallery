# Convert the proprietary Gallery of the Maxi Theme (Advanced Custom Forms) to a default WordPress Gutenberg Gallery Block

A script that helps migrating away from the Maxi Theme for WordPress (and possibly other themes using Advanced Custom Forms for Galleries with slight modifications to the code). Remember to always have backups and to check code you find on the internet yourself, this code comes with absolutely no liability.

## Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Edit database names in `src/entity/Post.ts` and `src/entity/PostMeta.ts`
3. Run `npm start` command
