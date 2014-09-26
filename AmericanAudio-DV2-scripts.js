function AmericanAudioDV2() {}

// when true volume levels for master left and right channels are shown by the volume LEDs
// when false volume for left and right decks are shown instead
AmericanAudioDV2.masterVolumeMode = true;

// counter used for initial flashing of the volume levels[A
AmericanAudioDV2.initFlashCounter = 8;

AmericanAudioDV2.init = function (id) 
{
    // initialize the volume mode connections and display
    AmericanAudioDV2.updateVolumeMode();

    // setup a timer to flash volume levels a few times upon startup
    // to indicate we are up and running!
    AmericanAudioDV2.initFlashTimerID 
        = engine.beginTimer(500, "AmericanAudioDV2.initFlashTimerHandler");
}

AmericanAudioDV2.toggleVolumeMode = function(channel, control, value) 
{
    // check the value byte to make sure we toggle on button press and not release
    if (value == 0x7F) {
        AmericanAudioDV2.masterVolumeMode = !AmericanAudioDV2.masterVolumeMode;
        AmericanAudioDV2.updateVolumeMode();
    }
}

AmericanAudioDV2.updateLeftVolume = function (value) 
{
    // input range is [0, 1]
    // output range is [0, 10]
    midi.sendShortMsg(0x90, 0x0F, value * 10);
}

AmericanAudioDV2.updateRightVolume = function (value) 
{
    // input range is [0, 1]
    // output range is [0, 10]
    midi.sendShortMsg(0x91, 0x10, value * 10);
}

AmericanAudioDV2.updateVolumeMode = function() 
{
    // clear current displays to be safe
    AmericanAudioDV2.updateLeftVolume(0);
    AmericanAudioDV2.updateRightVolume(0);

    // connect/disconnect event handlers based on masterVolumeMode
    engine.connectControl("[Master]", "VuMeterL", "AmericanAudioDV2.updateLeftVolume",
                          !AmericanAudioDV2.masterVolumeMode);
    engine.connectControl("[Master]", "VuMeterR", "AmericanAudioDV2.updateRightVolume",
                          !AmericanAudioDV2.masterVolumeMode);
    engine.connectControl("[Channel1]", "VuMeter", "AmericanAudioDV2.updateLeftVolume",
                          AmericanAudioDV2.masterVolumeMode);
    engine.connectControl("[Channel2]", "VuMeter", "AmericanAudioDV2.updateRightVolume",
                          AmericanAudioDV2.masterVolumeMode);

    // update volume mode indicator LEDs
    midi.sendShortMsg(0x90, 0x07,
                      AmericanAudioDV2.masterVolumeMode ? 0x7F : 0x00);
    midi.sendShortMsg(0x90, 0x0E,
                      AmericanAudioDV2.masterVolumeMode ? 0x00 : 0x7F);
}

AmericanAudioDV2.initFlashTimerHandler = function() 
{
    if (AmericanAudioDV2.initFlashCounter % 2 == 0) {
        // flash "on"
        AmericanAudioDV2.updateLeftVolume(1);
        AmericanAudioDV2.updateRightVolume(1);
    } else {
        // flash "off"
        AmericanAudioDV2.updateLeftVolume(0);
        AmericanAudioDV2.updateRightVolume(0);
    }
    --AmericanAudioDV2.initFlashCounter;
    if (AmericanAudioDV2.initFlashCounter <= 0) {
        // stop flashing
        engine.stopTimer(AmericanAudioDV2.initFlashTimerID);
    }
}
