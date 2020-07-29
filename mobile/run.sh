yarn tsc;
if [ $? -eq 1 ]
then 
  read -r -p "Typecheck failed! Continue building the app?" response
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]
  then
      yarn $1
  else
      exit
  fi
else
  yarn $1
fi