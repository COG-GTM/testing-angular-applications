cd website
npm install

npm run ng build -- --configuration production

cd ..

git clone git@github.com:testing-angular-applications/testing-angular-applications.github.io

cp -r website/dist/browser/* testing-angular-applications.github.io/
cd testing-angular-applications.github.io/

git add -A
git commit -m "commit to deploy website"
git push origin master

cd ..
rm -rf testing-angular-applications.github.io/
