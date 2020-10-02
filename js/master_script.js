var imagedir="../img/lights/";
function preload(){
    this.length=preload.arguments.length;
    for (var i=0;i<this.length;i++){
        this[i]=new Image();
        this[i].src=imagedir+preload.arguments[i];
    }
}

var pics=new preload("lo00.gif","lo10.gif",
                    "lo01.gif","lo11.gif",
                    "lo0.gif","lo1.gif",
                    "../buttons/edit.gif","../buttons/edit2.gif",
                    "../buttons/solve.gif","../buttons/solve2.gif");

var msk;
var moves;
var posit = new Array ();
var hnt = new Array ();
var mode = 0;   //0=normale  1=soluzione  2=edit

var qbit=new Array(1,2,4,8,16,32,64,128);
                //Usato invece che velocita 1<<x.

document.writeln("<table cellpadding=0 cellspacing=0 border=0>");
document.writeln("<\/select><\/form><\/td><\/tr>");
document.write("<tr><td colspan=7 class='button_table'>");
document.write("<a href='javascript:void hint();'><img src='../img/buttons/solve.gif' height=25 width=61 border=0 name='hint'><\/a>");
document.write("<a href='javascript:void mix();'><img src='../img/buttons/mix.gif' height=25 width=61 border=0><\/a>");
document.write("<a href='javascript:void reset();'><img src='../img/buttons/reset.gif' height=25 width=61 border=0><\/a>");
document.write("<a href='javascript:void edit();'><img src='../img/buttons/edit.gif' height=25 width=61 border=0 name='edit'><\/a>");
document.writeln("<\/td><\/tr>");

for(var i=1;i<=5;i++){
    document.writeln("<tr><td width=50><\/td>");
    for(var j=1;j<=5;j++){
        document.writeln("  <td><a href='javascript:void clicked("+i+","+j+");'>"+
            "<img src='"+pics[4].src+"' height=50 width=50 "+
            "name='brd"+i+""+j+"' border=0><\/a><\/td>");
    }
    document.writeln("<td width=50><\/td><\/tr>");
}
document.writeln("<\/table>");

function initbrd(){
    for(var i=0;i<=6;i++) { posit[i]=0; hnt[i]=0; }
    moves=0;
    showbrd();
    msk=qbit[6]-2;
}
function initpuz(p){
    if(p){
        for(var i=1;i<=5;i++){
            posit[i]=2*puz[p-1][i-1];
            hnt[i]=0;
        }
        moves=0;
        mode=1;
        showbrd();
    }
}
function draw(y,x){
    var c=0;
    if(x>=1 && y>=1 && y<=5 && x<=5){
        if(posit[y]&qbit[x]) c=1;
        if(mode==3){
            if(hnt[y]&qbit[x]) c+=2;
        }else c+=4;
        document.images["brd"+y+""+x].src=pics[c].src;
    }
}
function showbrd(){
    //riscrive tutte le immagini sullo schermo. (aggiorna la schermata)
    for(var i=1;i<=5;i++) {
        var k=2;
        for(var j=1;j<=5;j++) {
            var c=0
            if(posit[i]&k) c=1;
            if(mode==3){
                if(hnt[i]&k) c+=2;
            }else c+=4;
            document.images["brd"+i+""+j].src=pics[c].src;
            k+=k;
        }
    }
    if(mode==2) document.images["edit"].src=pics[7].src;
    else document.images["edit"].src=pics[6].src;
    if(mode==3) document.images["hint"].src=pics[9].src;
    else document.images["hint"].src=pics[8].src;
}
function onResize(){
    showbrd();
}

initbrd();

function reset(){
    //pulizia schermo
    mode=0;
    initbrd();
}
function domove(y,x,k){
    //Fai le mosse. Aggiorna schermo if k set
    posit[y]^=qbit[x+2]-qbit[x-1];
    posit[y-1]^=qbit[x];
    posit[y+1]^=qbit[x];
    if(mode==2) hnt[y]^=qbit[x];
    if(k) {
        //aggiorna solo le celle che hanno valore
        draw(y,x);
        draw(y-1,x);
        draw(y+1,x);
        draw(y,x-1);
        draw(y,x+1);
    }
}
function clicked(y,x){
    //click sulla cella (y,x)
    if(mode==2){
        //aggiornamento, elimina solo una luce
        posit[y]^=qbit[x]; draw(y,x);
    }else{
        //normale movimento
        if(mode==3) hnt[y]^=qbit[x];  //toglie il marker del consiglio
        domove(y,x,1);
        moves++;
        if(mode==1 && solved()){
            alert("You solved it in "+moves+" moves.\nYou don't get a prize for this though!");
            mode=0;
        }
    }
    this.focus();
}
function solved(){
    //controlla se la tavola e risolta
    for(var i=1;i<=5;i++){
        if(posit[i]&msk) return(false);
    }
    return(true);
}

function mix(){
    //posiziona tavolòa random
    initbrd();
    for(var i=1;i<=5;i++){
        var d=2*Math.floor(Math.random()*qbit[5]);
        //inserisci un pattern random nella riga corrente
        posit[i]^=d^(d+d)^(d>>1);
        posit[i+1]^=d;
        posit[i-1]^=d;
    }
    mode=1;
    moves=0;
    showbrd();
}


function edit(){
    // Edit button clicked
    if(mode==2) {
        //fine editing dovrebbe controllarela possibilita di soluzione
        if(hintson()){
            mode=1;
            showbrd();
        }else alert("This position cannot be solved!");
    }else {
        //inizio editing
        mode=2;
        showbrd();
    }
}

function hint(){
    //bottone hint premuto
    if(mode==3) {
        //hints off
        mode=0;
        showbrd();
    }else if(mode!=2){
        //hints on
        if(hintson()) mode=3;
        showbrd();
    }
}

function solvbot(f){
    // solve board till bottom row. If f set then adjust hnt accordingly
    for(i=2;i<=5;i++){
        var c=posit[i-1]&msk;
        posit[i]^=c^(c+c)^(c>>1);
        posit[i+1]^=c;
        posit[i-1]=0;
        if(f) hnt[i]^=c;
    }

}
function hintson(){
    //Find solution, and put it into hnt array
    //Board remains unchanged.
    //If no solution found, then return false, else return true

    //backup board, and set board to accept hints
    var backup = new Array();
    for(var i=0;i<=5;i++) backup[i]=posit[i];
    for(var i=1;i<=5;i++) hnt[i]=0;

    //solve board up to last row
    solvbot(1);

    //save bottom row vector
    var aim = posit[5];
    posit[5]=0;

    //Build up matrix of bottom rows for each possible top light
    var bot = new Array (34,20,56,0, 0 );
    var inv = new Array (6, 14,12,54,42)

    //Note rows below l are 0, i.e. push patterns that have no effect.
    //Now try to make aim from non-zero rows
    m=0; //current row
    for(var k=1;k<=5;k++){   //current column
        var c=qbit[k];
        if(bot[m]&c){
            if(aim&c){
                aim^=bot[m];
                //push top buttons as indicated in inv matrix
                var d=inv[m];
                hnt[1]^=d;
                posit[1]=(posit[1]^d^(d+d)^(d>>1))&msk;
                posit[2]^=d;
            }
            m++; //move to next row
        }
    }
    //Error if aim has not been attained
    if(aim&msk){
        //restore board
        for(i=0;i<=5;i++) posit[i]=backup[i];
        return(false);
    }
    //Expand solution
    solvbot(1);

    //Should now check whether can minimise solution by adding a zero row
    aim=counthnt();
    //save current position
    var backhnt=new Array;
    for(var i=1;i<=5;i++) backhnt[i]=hnt[i];

    //get complete push pattern generators
    var invar= new Array();
    invar[0]=new Array(54,0,54,0,54);
    invar[1]=new Array(42,42,0,42,42);
    invar[2]=new Array(28,42,54,42,28);

    //run through all non-zero combinations of the push patterns.
    for(c=0;c<=2;c++){
        //check combination c; each bit indicates one of the final rows to add
        for(var i=1;i<=5;i++) hnt[i]=backhnt[i]^invar[c][i-1];
        //check if found better solution
        j=counthnt();
        //alert("aim="+aim+" new="+j+"\nold="+backhnt+"\nhnt="+hnt);
        if(j<aim){
            for(var i=1;i<=5;i++) backhnt[i]=hnt[i];
            aim=j;
        }
    }
    //restore hnt
    for(var i=1;i<=5;i++) hnt[i]=backhnt[i];

    //restore board
    for(i=1;i<=5;i++) posit[i]=backup[i];
    return(true);
}


//used to quickly count number of bits set.
var qcnt=new Array(0,1,1,2,1,2,2,3,1,2,2,3,2,3,3,4,
                     1,2,2,3,2,3,3,4,2,3,3,4,3,4,4,5);
function counthnt(){
    //count number of buttons pressed, i.e. number of bits set in hnt.
    var c=0;
    for(var i=1;i<=5;i++){
        c+=qcnt[hnt[i]>>1]+qcnt[hnt[i]>>6];
    }
    return(c);
}