
enum PinAssignments {
  encoderPinA = 2,   // right
  encoderPinB = 3,   // left
  clearButton = 8    // another two pins
};

volatile unsigned int encoderPos = 0;  // a counter for the dial
int doubleClickCount = 0, buttonStartState, lastButtonStartState = LOW, buttonBuyState, lastButtonBuyState = LOW;
unsigned int lastReportedPos = 1;   // change management
bool lastValueStart = false, lastValueBuy = false, valueStart = false, valueBuy = false;
static boolean rotating = false, debounceStart = false, debounceBuy = false;     // debounce management
const unsigned long doubleClickTimer = 500, startTimer = 200, BuyTimer = 200, debounceDelay = 50;
unsigned long doubleClickTime = 0, interruptStartTime = 0, interruptBuyTime = 0, lastDebounceTimeStart, lastDebounceTimeBuy;

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
}

void loop()
{
  // Lettura ingressi digitali
  Start_State = digitalRead(Start);
  Buy_State = digitalRead(Buy);

  rotating = true;  // reset the debouncer
  debounceStart = true;  // reset the debouncer
  debounceBuy = true;  // reset the debouncer



  //Gestione pulsante di start
  if (Start_State != lastButtonStartState) {
    // reset the debouncing timer
    lastDebounceTimeStart = millis();
  }

  if ((millis() - lastDebounceTimeStart) > debounceDelay) {
    // if the button state has changed:
    if (Start_State != buttonStartState) {
      buttonStartState = Start_State;
      // only toggle the LED if the new button state is HIGH
      if (buttonStartState == LOW) {
        doubleClickCount = doubleClickCount + 1;
        valueStart = true;
        doubleClickTime = millis();
      }
    }
  }

  if (millis()-doubleClickTime <= doubleClickTimer)
  {
    if (doubleClickCount >= 2)
    {
      Serial.println("Double press detected!");
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
    }
    doubleClickCount = 0;
  }

  lastButtonStartState = Start_State;



  //Gestione pulsante Buy
  if (Buy_State != lastButtonBuyState) {
    // reset the debouncing timer
    lastDebounceTimeBuy = millis();
  }

  if ((millis() - lastDebounceTimeBuy) > debounceDelay) {
    // if the button state has changed:
    if (Buy_State != buttonBuyState) {
      buttonBuyState = Buy_State;
      // only toggle the LED if the new button state is HIGH
      if (buttonBuyState == LOW) {
        valueBuy = true;
        Serial.println("Buy pressed!");
        //doubleClickTime = millis();
      }
    }
  }

  lastButtonBuyState = Buy_State;

  //Gestione encoder
    if (lastReportedPos != encoderPos) {
    Serial.print("Selected Value: ");
    Serial.println(encoderPos, DEC);
    lastReportedPos = encoderPos;
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
    if ( A_set && !B_set)
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
    if ( B_set && !A_set )
      encoderPos -= 1;

    rotating = false;
  }
}