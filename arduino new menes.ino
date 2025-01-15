
enum PinAssignments {
  encoderPinA = 2,   // right
  encoderPinB = 3,   // left
  clearButton = 8    // another two pins
};

volatile unsigned int encoderPos = 0;  // a counter for the dial
int doubleClickCount = 0;
unsigned int lastReportedPos = 1;   // change management
bool lastValueStart = false, lastValueBuy = false, valueStart = false, valueBuy = false;
static boolean rotating = false, debounceStart = false, debounceBuy = false;     // debounce management
const int encoderRange = 1000;
const unsigned long doubleClickTimer = 1000;
unsigned long doubleClickTime = 0;

// interrupt service routine vars
boolean A_set = false;
boolean B_set = false;


// Pulsanti
const int Start = 18, Buy = 19;
bool Start_State, Video_State, Buy_State;

void setup()
{
  Serial.begin(9600);

  // Configura i pin dei pulsanti
  pinMode(Start, INPUT);
  pinMode(Buy, INPUT);

  pinMode(encoderPinA, INPUT_PULLUP);
  pinMode(encoderPinB, INPUT_PULLUP);
  digitalWrite(encoderPinA, HIGH);
  digitalWrite(encoderPinB, HIGH);
  // encoder pin on interrupt 0 (pin 2)
  attachInterrupt(0, doEncoderA, CHANGE);
  // encoder pin on interrupt 1 (pin 3)
  attachInterrupt(1, doEncoderB, CHANGE);

  // Start pin on interrupt 2 (pin 18)
  attachInterrupt(4, StartInterrupt, RISING);
}

void loop()
{
  // Lettura ingressi digitali
  //Start_State = digitalRead(Start);
  //Video_State = digitalRead(Video);
  Buy_State = digitalRead(Buy);

  rotating = true;  // reset the debouncer
  debounceStart = true;  // reset the debouncer
  debounceBuy = true;  // reset the debouncer


  if (lastReportedPos != encoderPos) {
    Serial.print("Selected Value: ");
    Serial.println(encoderPos, DEC);
    lastReportedPos = encoderPos;
  }

  if (millis()-doubleClickTime <= doubleClickTimer)
  {
    if (doubleClickCount >= 2)
    {
      Serial.println("Double press detected!");
      encoderPos = 0;
      doubleClickCount = 0;
      valueStart = false;
    }
  }else
  {
    if (valueStart)
    {
      Serial.println("Start pressed!");
      Serial.println("Short press detected!");
      valueStart = false;
      encoderPos = 0;
    }
    doubleClickCount = 0;
  }


  // Gestione del pulsante Buy
  if (Buy_State) {
    Serial.println("Buy pressed!");
  }

  
}



void doEncoderA() 
{
  // debounce
  if ( rotating ) delay (1);  // wait a little until the bouncing is done

  // Test transition, did things really change?
  if ( digitalRead(encoderPinA) != A_set ) { // debounce once more
    A_set = !A_set;

    // adjust counter + if A leads B
    if ( A_set && !B_set && encoderPos<encoderRange)
      encoderPos += 1;

    rotating = false;  // no more debouncing until loop() hits again
  }
}

// Interrupt on B changing state, same as A above
void doEncoderB() 
{
  if ( rotating ) delay (1);
  if ( digitalRead(encoderPinB) != B_set ) {
    B_set = !B_set;
    //  adjust counter - 1 if B leads A
    if ( B_set && !A_set && encoderPos>0)
      encoderPos -= 1;

    rotating = false;
  }
}

void StartInterrupt ()
{
  if ( debounceStart ) delay (5);
  doubleClickTime = millis();
  doubleClickCount = doubleClickCount + 1;
  valueStart = true;
  debounceStart = false;
}

