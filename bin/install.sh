function install(){
   if [ ! -d $1 ]; then
        mkdir  -p $1;
        cd $1
        echo "Installing ..."
    #     git clone git@github.com:ongojs/ongojs.git . 
    #     git checkout dev;
    #     yarn 
    #    # npm install; 
    #    # npm update; 
    #    # npm upgrade; 
    #    rm -rdf .git 
    else 
        echo "Project directory exists!";
    fi
   
}

install $1;