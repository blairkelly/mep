//com
String sBuffer = "";
String usbInstructionDataString = "";
int usbCommandVal = 0;
boolean USBcommandExecuted = true;
String usbCommand = "";

void setup() {            //This function gets called when the Arduino starts
    Serial.begin(57600);   //This code sets up the Serial port at 115200 baud rate
}

void printsbuffer () {
    //print sBuffer
    if(sBuffer != "") {
        Serial.println(sBuffer);
        sBuffer = "";
    }
}
void addtosbuffer (String param, String value) {
    if(sBuffer == "") {
        sBuffer = "t=" + (String)millis() + "&" + param + "=" + value;
    } else {
        sBuffer = sBuffer + "&" + param + "=" + value;
    }
}

void delegate(String cmd, int cmdval) {
    if (cmd.equals("p")) {
        if (cmdval == 0) {
            digitalWrite(7, HIGH); //off
            addtosbuffer("powerswitchtail", "0");
        } else if (cmdval == 1) {
            digitalWrite(7, LOW); //ON
            addtosbuffer("powerswitchtail", "1");
        }
    }
}

void serialListen()
{
    char arduinoSerialData; //FOR CONVERTING BYTE TO CHAR. here is stored information coming from the arduino.
    String currentChar = "";
    if(Serial.available() > 0) {
        arduinoSerialData = char(Serial.read());   //BYTE TO CHAR.
        currentChar = (String)arduinoSerialData; //incoming data equated to c.
        if(!currentChar.equals("1") && !currentChar.equals("2") && !currentChar.equals("3") && !currentChar.equals("4") && !currentChar.equals("5") && !currentChar.equals("6") && !currentChar.equals("7") && !currentChar.equals("8") && !currentChar.equals("9") && !currentChar.equals("0") && !currentChar.equals(".")) { 
            //the character is not a number, not a value to go along with a command,
            //so it is probably a command.
            if(!usbInstructionDataString.equals("")) {
                //usbCommandVal = Integer.parseInt(usbInstructionDataString);
                char charBuf[30];
                usbInstructionDataString.toCharArray(charBuf, 30);
                usbCommandVal = atoi(charBuf);

            }
            if((USBcommandExecuted == false) && (arduinoSerialData == 13)) {
            
                delegate(usbCommand, usbCommandVal);
                USBcommandExecuted = true;
            
            }
            if((arduinoSerialData != 13) && (arduinoSerialData != 10)) {
                usbCommand = currentChar;
            }
            usbInstructionDataString = "";
        } else {
            //in this case, we're probably receiving a command value.
            //store it
            usbInstructionDataString = usbInstructionDataString + currentChar;
            USBcommandExecuted = false;
        }
    }
}

void readSensors()
{
    int reading = 0;
    String pin_name = "";
    for (int f_pin = 0; f_pin < 4; f_pin++) {
        reading = 0;
        pin_name = "f" + String( f_pin );
        for (int i = 0; i < 4; ++i) {
            reading += analogRead(f_pin);
            delay(3);
        }
        addtosbuffer(pin_name, String( reading / 4 ));
    }
    delay(100);
}

void loop() {             //This function loops while the arduino is powered
    serialListen();
    readSensors();
    printsbuffer();
}