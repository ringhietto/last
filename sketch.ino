const int N_Range_1 = 4, N_Range_2 = 3, N_Range_3 = 2, N_Range_4 = 3;
const int Massimi_Impulsi_Anni = 150, Massimi_Impulsi_Mesi = 36, Massimi_Impulsi_Giorni = 155;   
//const int Led_1_Gun = 30, Led_1_Transport = 31, Led_1_Fall = 32, Led_1_Overdose = 33, Led = 36//Led prima manopola
const int Led_1_Murder = 30, Led_1_Accident = 31, Led_1_Overdose = 32, Led_1_Suicide = 33, Led_1_Illness = 36; //Led prima manopola
const int Start = 13, Video = 12, Buy = 11;

const int N_Selez_Man_1 = 5;

volatile unsigned int Temp_Anno, Cont_Encoder_Anno = 0; //Ecoder rotella data anno
volatile unsigned int Temp_Mese, Cont_Encoder_Mese = 0; //Ecoder rotella data mese
volatile unsigned int Temp_Giorno, Cont_Encoder_Giorno = 0; //Ecoder rotella data giorno

int Valore_Analogico_1, Val_Selezione;
int Impulsi_Range_1;
int Impulsi_Range_Anni, Impulsi_Range_Mesi, Impulsi_Range_Giorni;

//Segnali comunicazione con Touch 
//bool Man_1_Gun, Man_1_Transport, Man_1_Fall, Man_1_Overdose; //Man 1 Segnali Selezione
bool Man_1_Murder, Man_1_Accident, Man_1_Overdose, Man_1_Suicide, Man_1_Illness; //Man 1 Segnali Selezione
bool Start_State, Video_State, Buy_State;

unsigned long Delta_T_Stampa, Delta_T_Analog_Read;

void setup() {
  Serial.begin(9600);

  //Definizione range
  Impulsi_Range_1 = 1024/N_Selez_Man_1;

  Impulsi_Range_Anni = Massimi_Impulsi_Anni/50; //10 impulsi ad anno
  Impulsi_Range_Mesi = Massimi_Impulsi_Mesi/12; //10 impulsi a mese
  Impulsi_Range_Mesi = Massimi_Impulsi_Giorni/31; //5 impulsi a giorno

  //Pulsanti 
  pinMode(Start, INPUT);
  pinMode(Video, INPUT);
  pinMode(Buy, INPUT);

  //Led prima Manopola 
  pinMode(Led_1_Murder, OUTPUT);
  pinMode(Led_1_Accident, OUTPUT);
  pinMode(Led_1_Overdose, OUTPUT);
  pinMode(Led_1_Suicide, OUTPUT);
  pinMode(Led_1_Illness, OUTPUT);

  //Primo Encoder
  pinMode(2, INPUT_PULLUP); 
  pinMode(3, INPUT_PULLUP); 
  attachInterrupt(0, ai0, RISING); 
  attachInterrupt(1, ai1, RISING);

  //Secondo Encoder
  pinMode(18, INPUT_PULLUP); 
  pinMode(19, INPUT_PULLUP); 
  attachInterrupt(2, ai2, RISING); 
  attachInterrupt(3, ai3, RISING);

  //Terzo Encoder
  pinMode(20, INPUT_PULLUP); 
  pinMode(21, INPUT_PULLUP); 
  attachInterrupt(4, ai4, RISING); 
  attachInterrupt(5, ai5, RISING);

}

void loop() {

  //Lettura ingressi digitali
  Start_State = digitalRead(Start);
  Video_State = digitalRead(Video);
  Buy_State = digitalRead(Buy);

  //Lettura ingressi analogici manopola
  unsigned long Millis_Analog_Read = millis(); 

  if (Millis_Analog_Read - Delta_T_Analog_Read > 250)
  {
    Valore_Analogico_1 = analogRead(A0);
  }


  //Gestione Conteggi Encoder Anno 
  if (Cont_Encoder_Anno != Temp_Anno)
     {
      //Serial.println(Cont_Encoder_Anno); //stampo il valore del conteggio sul monitor 
      Temp_Anno = Cont_Encoder_Anno;
     }
  //Serial.println(Cont_Encoder_Anno);

  //Gestione Conteggi Encoder Mesi 
  if (Cont_Encoder_Mese != Temp_Mese)
     {
      //Serial.println(Cont_Encoder_2); //stampo il valore del conteggio sul monitor 
      Temp_Mese = Cont_Encoder_Mese;
     }

  //Gestione Conteggi Encoder Giorni
  if (Cont_Encoder_Giorno != Temp_Giorno)
     {
      //Serial.println(Cont_Encoder_3); //stampo il valore del conteggio sul monitor 
      Temp_Giorno = Cont_Encoder_Giorno;
     }
    

  //Gestione range ed uscite associate manopola 1
    if ((Valore_Analogico_1 >= 0) and (Valore_Analogico_1 < (Impulsi_Range_1*1)))
    {
      Man_1_Murder = true;
      digitalWrite(Led_1_Murder, HIGH);
      
      Val_Selezione = 1;


    }
    else
    {
      Man_1_Murder = false;
      digitalWrite(Led_1_Murder, LOW);
    }

    if ((Valore_Analogico_1 >= (Impulsi_Range_1*1)) and (Valore_Analogico_1 < (Impulsi_Range_1*2)))
    {
      Man_1_Accident = true;
      digitalWrite(Led_1_Accident, HIGH);

      Val_Selezione = 2;

    }
    else
    {
      Man_1_Accident = false;
      digitalWrite(Led_1_Accident, LOW);
    }

    if ((Valore_Analogico_1 >= (Impulsi_Range_1*2)) and (Valore_Analogico_1 < (Impulsi_Range_1*3)))
    {
      Man_1_Overdose = true;
      digitalWrite(Led_1_Overdose, HIGH);

      Val_Selezione = 3;

    }
    else
    {
      Man_1_Overdose = false;
      digitalWrite(Led_1_Overdose, LOW);
    }

    if ((Valore_Analogico_1 >= (Impulsi_Range_1*3)) and (Valore_Analogico_1 < (Impulsi_Range_1*4)))
    {
      Man_1_Suicide = true;
      digitalWrite(Led_1_Suicide, HIGH);

      Val_Selezione = 4;

    }
    else
    {
      Man_1_Suicide = false;
      digitalWrite(Led_1_Suicide, LOW);
    }

    if ((Valore_Analogico_1 >= (Impulsi_Range_1*4)) and (Valore_Analogico_1 < (Impulsi_Range_1*5)))
    {
      Man_1_Illness = true;
      digitalWrite(Led_1_Illness, HIGH);

      Val_Selezione = 5;

    }
    else
    {
      Man_1_Illness = false;
      digitalWrite(Led_1_Illness, LOW);
    }

    //Stampo gli stati degli della macchina su monitor seriale
     unsigned long Millis_Stampa = millis(); 

     if (Millis_Stampa - Delta_T_Stampa > 500)
    {

      Delta_T_Stampa = Millis_Stampa;

      // Serial.print("Cont_Encoder_Anno : ");
      // Serial.println(Cont_Encoder_Anno);
      // Serial.print("Cont_Encoder_Mese 2: ");
      // Serial.println(Cont_Encoder_Mese);
      // Serial.print("Cont_Encoder_Giorno 3: ");
      // Serial.println(Cont_Encoder_Giorno);

      Serial.print("Start_State: ");
      Serial.println(Start_State);
      Serial.print("Video_State: ");
      Serial.println(Video_State);
      Serial.print("Buy_State: ");
      Serial.println(Buy_State);

      Serial.print("Val Analogico Manopola 1: ");
      Serial.println(Val_Selezione);
    }
    
     
}



//Gestione Canali Encoder 1
void ai0()
  {
    if(digitalRead(3)==LOW) 
      {
        if (Cont_Encoder_Anno < Massimi_Impulsi_Anni)
        {
          Cont_Encoder_Anno++;
        }
      }
    else
      {
        if (Cont_Encoder_Anno > 0)
        {
          Cont_Encoder_Anno--;
        }
      }
  }
void ai1()
  {
    if(digitalRead(2)==LOW)
      {
        if (Cont_Encoder_Anno > 0)
        {
          Cont_Encoder_Anno--;
        }
      }
    else
      {
       if (Cont_Encoder_Anno < Massimi_Impulsi_Anni)
        {
          Cont_Encoder_Anno++;
        }
      }
  }

//Gestoine Canali Encoder 2
void ai2()
  {
    if(digitalRead(19)==LOW) 
      {
        if (Cont_Encoder_Mese < Massimi_Impulsi_Mesi)
        {
          Cont_Encoder_Mese++;
        }
      }
    else
      {
        if (Cont_Encoder_Mese > 0)
        {
          Cont_Encoder_Mese--;
        }
      }
  }
void ai3()
  {
    if(digitalRead(18)==LOW)
      {
        if (Cont_Encoder_Mese > 0)
        {
          Cont_Encoder_Mese--;
        }
      }
    else
      {
       if (Cont_Encoder_Mese < Massimi_Impulsi_Mesi)
        {
          Cont_Encoder_Mese++;
        }
      }
  }

//Gestoine Canali Encoder 3
void ai4()
  {
    if(digitalRead(20)==LOW) 
      {
        if (Cont_Encoder_Giorno < Massimi_Impulsi_Giorni)
        {
          Cont_Encoder_Giorno++;
        }
      }
    else
      {
        if (Cont_Encoder_Giorno > 0)
        {
          Cont_Encoder_Giorno--;
        }
      }
  }
void ai5()
  {
    if(digitalRead(21)==LOW)
      {
        if (Cont_Encoder_Giorno > 0)
        {
          Cont_Encoder_Giorno--;
        }
      }
    else
      {
       if (Cont_Encoder_Giorno < Massimi_Impulsi_Giorni)
        {
          Cont_Encoder_Giorno++;
        }
      }
  }

