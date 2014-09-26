function AmericanAudioDV2() {}

AmericanAudioDV2.masterVolumeMode = true;

AmericanAudioDV2.init = function (id) {
    AmericanAudioDV2.updateVolumeMode();
}

AmericanAudioDV2.toggleVolumeMode = function(channel, control, value) {
    // check the value byte to make sure we toggle on button press and not release
    if (value == 0x7F) {
        AmericanAudioDV2.masterVolumeMode = !AmericanAudioDV2.masterVolumeMode;
        AmericanAudioDV2.updateVolumeMode();
    }
}

AmericanAudioDV2.updateLeftVolume = function (value) {
    // output range is [0, 10]
    midi.sendShortMsg(0x90, 0x0F, value * 10);
}

AmericanAudioDV2.updateRightVolume = function (value) {
    // output range is [0, 10]
    midi.sendShortMsg(0x91, 0x10, value * 10);
}

AmericanAudioDV2.updateVolumeMode = function() {
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
