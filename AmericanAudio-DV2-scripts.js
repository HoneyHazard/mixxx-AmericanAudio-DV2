function AmericanAudioDV2() {}

AmericanAudioDV2.init = function (id) {
    midi.sendShortMsg(0x91, 0x0F, 0x5);

    engine.connectControl("[Master]", "VuMeterL", "AmericanAudioDV2.leftVolume");
    engine.connectControl("[Master]", "VuMeterR", "AmericanAudioDV2.rightVolume");
}

AmericanAudioDV2.leftVolume = function (value) {
    midi.sendShortMsg(0x90, 0x0F, value * 10);
}

AmericanAudioDV2.rightVolume = function (value) {
    midi.sendShortMsg(0x91, 0x10, value * 10);
}

